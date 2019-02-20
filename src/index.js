import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import Promise from 'bluebird';// overide mongoose promise
import dotenv from 'dotenv';

import auth from './routes/auth';

dotenv.config()
const app = express();
app.use(bodyParser.json())
mongoose.Promise = Promise;
mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true })

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use('/api/auth', auth);

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/api/auth', (req, res) => {
    res.status(404).json({ errors: { global: 'Something went wrong form database' } });
})

app.listen(8080, () => console.log('running in port 8080'))

