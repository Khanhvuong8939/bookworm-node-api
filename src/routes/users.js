import express from 'express';
import User from './../models/User';

const router = express.Router();

router.post('', (req, res) => {
    console.log('here')
    const { email, password } = req.body.user;
    const user = new User({ email, password });
    user.setPassword(password);
    user.save()
        .catch(err => res.json({ err }))
})

export default router;