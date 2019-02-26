import express from 'express';
import User from '../models/User.js';

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
    console.log(token)
    User.findOneAndUpdate(
        { confirmationToken: token },
        { confirmationToken: '', confirmed: true },
        { new: true }
    ).then(user => {
        console.log(user)
        user ? res.json({ user: user.toAuthJson() }) : res.status(400).json({ err: 'error' })
    })
})

export default router;