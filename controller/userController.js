const User = require('../model/user');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const {
    createTokenUser,
    attachCookiesToResponse,
    checkPermissions } = require('../utils')

const getAllUsers = async (req, res) => {
    console.log(req.user);
    const users = await User.find({ role: 'user' }).select('-password');
    res.status(StatusCodes.OK).json({ users, count: users.length });
};

const getSingleUser = async (req, res) => {
    const user = await User.findOne({ _id: req.params.id }).select('-password');
    if (!user) {
        throw new CustomError.NotFoundError(`No user with id : ${req.params.id}`);
    }
    checkPermissions(req.user, user._id);
    res.status(StatusCodes.OK).json({ user });
};
const getCurrentUser = async (req, res) => {
    res.status(StatusCodes.OK).json({ user: req.user });
};

const updateUser = async (req, res) => {
    const { email, firstName, lastName } = req.body
    if (!email || !firstName || !lastName) {
        throw new CustomError.BadRequestError('please provide all values ');
    }
    const user = await User.findByIdAndUpdate(
        { _id: req.user.userId },
        { email, firstName, lastName },
        { new: true, runValidators: true }
    );
    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({ res, user: tokenUser });
    res.status(StatusCodes.OK).json({ user: tokenUser });
};

const updateUserPassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
        throw new CustomError.BadRequestError('passwords can not be empty');
    };
    const user = await User.findOne({ _id: req.user.userId });
    const isPasswordCorrect = await user.comparePassword(oldPassword);
    if (!isPasswordCorrect) {
        throw new CustomError.NotFoundError('invalid credential');
    }
    user.password = newPassword
    await user.save();
    res.status(StatusCodes.CREATED).json({ msg: 'password changed successfully' });
};

module.exports = {
    getAllUsers,
    getCurrentUser,
    getSingleUser,
    updateUser,
    updateUserPassword
}
