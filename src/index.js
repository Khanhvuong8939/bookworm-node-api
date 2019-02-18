import express from 'express';
import path from 'path';

const app = express();

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/api/auth', (req, res) => {
    res.status(404).json({ errors: { global: 'invalid credentials' } });
})

app.listen(8080, () => console.log('running in port 8080'))