import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// TODO: add unique email and validation to email field

const schema = new mongoose.Schema({
    email: { type: String, required: true, lowercase: true },
    passwordHash: { type: String, required: true }
}, { timestamps: true });

schema.methods.isValidPassword = function isValidPassword(password) {
    return bcrypt.compareSync(password, this.passwordHash);
};

schema.methods.generateToken = function generateToken() {
    return jwt.sign(
        {
            email: this.email
        }, process.env.SECRETKEY
    );
};

schema.methods.toAuthJson = function toAuthJson() {
    return {
        email: this.email,
        token: this.generateToken()
    }
}

export default mongoose.model('User', schema);