import express from 'express';
import path from 'path';

const app = express();

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/api/auth', (req, res) => {
    console.log('come here ?')
    res.status(404).json({ errors: { global: 'invalid credentials' } });
})

app.listen(8080, () => console.log('running in port 8080'))

