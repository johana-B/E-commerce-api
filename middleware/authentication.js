const CustomError = require('../errors');
const { isTokenValid } = require('../utils');

const authenticateUser = async (req, res, next) => {
    const token = req.signedCookies.token
    if (!token) {
        throw new CustomError.UnauthenticatedError('authentication invalid')
    }
    try {
        const { firstName, lastName, userId, role } = isTokenValid({ token });
        req.user = { firstName, lastName, userId, role };
        next();
    } catch (error) {
        throw new CustomError.UnauthenticatedError('authentication invalid')
    }

}

const autorizedUser = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new CustomError.unauthorizedError(
                'Unauthorized to access this route'
            );
        }
        next();
    };
};
module.exports = {
    authenticateUser,
    autorizedUser
}