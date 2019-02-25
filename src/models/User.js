import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import uniqueValidator from 'mongoose-unique-validator';

// TODO: add unique email and validation to email field

const schema = new mongoose.Schema({
    email: { type: String, required: true, lowercase: true, unique: true },
    passwordHash: { type: String, required: true },
    confirmed: false
}, { timestamps: true });

schema.methods.isValidPassword = function isValidPassword(password) {
    return bcrypt.compareSync(password, this.passwordHash);
};

schema.methods.setPassword = function setPassword(password) {
    this.passwordHash = bcrypt.hashSync(password, 10)
}

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
        confirmed: this.confirmed,
        token: this.generateToken(),
    }
}

schema.plugin(uniqueValidator, { message: 'this email already taken' })

export default mongoose.model('User', schema);