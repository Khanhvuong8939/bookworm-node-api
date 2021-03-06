import express from 'express';
import User from './../models/User';
import errorParser from './../utils/errorParser'
import { sendConfirmationEmail } from '../../mailer'
const router = express.Router();

router.post('', (req, res) => {
    const { email, password } = req.body.data;
    const user = new User({ email, password });
    user.setPassword(password);
    user.setConfirmationToken();
    user.save()
        .then(userRecord => {
            sendConfirmationEmail(userRecord);
            res.status(200).json({ user: userRecord.toAuthJson() })
        })
        .catch(err => {
            res.status(400).json({ errors: errorParser(err.errors) })
        }
        )
})

export default router;