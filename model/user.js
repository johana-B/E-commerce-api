const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'first name should be provided'],
        trim: true,
        minlength: 3,
        maxlength: 50
    },
    lastName: {
        type: String,
        required: [true, 'last name should be provided'],
        trim: true,
        maxlength: 50
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'email should be provided'],
        validate: {
            validator: validator.isEmail,
            message: 'please provide valid email'
        },
    },
    password: {
        type: String,
        required: [true, 'password should be provided'],
        trim: true,
        minlength: 6,
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
}, { timestamps: true });

UserSchema.pre('save', async function () {
    if (!this.isModified('password')) return
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});
UserSchema.methods.comparePassword = async function (candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
};


const userSchema = mongoose.model('user', UserSchema)
module.exports = userSchema