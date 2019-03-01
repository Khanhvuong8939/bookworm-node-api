import express from 'express';
import User from '../models/User.js';
import { sendResetPasswordEmail } from '../../mailer'
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/', (req, res) => {
    const { credentials } = req.body;
    User.findOne({ email: credentials.email })
        .then(user => {
            if (user && user.isValidPassword(credentials.password)) {
                console.log(user.toAuthJson())
                res.json({
                    user: user.toAuthJson()
                });
            } else {
                res.status(400).json({ errors: { global: 'Invalid credentials' } })
            }
        });

})

router.post('/confirmation', (req, res) => {
    const token = req.body.token;
    User.findOneAndUpdate(
        { confirmationToken: token },
        { confirmationToken: '', confirmed: true },
        { new: true }
    ).then(user => {
        user ? res.json({ user: user.toAuthJson() }) : res.status(400).json({ err: 'error' })
    })
})

router.post('/reset_password_request', (req, res) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (user) {
                sendResetPasswordEmail(user);
                res.status(200).json({ 'resetEmail': 'successful' })
            } else {
                res.status(404).json({ errors: { global: 'There is no user with such email!!!' } })
            }

        })
})

router.post('/validate_token', (req, res) => {
    jwt.verify(req.body.token, process.env.SECRETKEY, err => {
        if (err) {
            res.status(401).json({})
        } else {
            res.status(200).json({})
        }
    })
})

router.post('/reset_password', (req, res) => {
    var { token, password } = req.body.data;
    jwt.verify(token, process.env.SECRETKEY, (err, decoded) => {
        if(err) {
            res.status(401).json({errors: {global: 'Invalid token'}})
        } else {
            User.findOne({_id: decoded._id})
            .then(user => {
                if(user) {
                    user.setPassword(password);
                    user.save().then(()=>res.status(200).json({}))
                } else {
                    res.status(404).json({errors: 'Invalid token'})
                }
            })
        }
        
        0
    })
})

export default router;