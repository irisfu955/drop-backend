const express = require('express');
const serverless = require('serverless-http');

const app = express();
app.use(express.json());

const body = 'body';
const fakeText = 'fake text';

app.get('/explanation', async function (req, res) {
    res.json({ body, fakeText });
});

app.use((req, res, next) => {
    return res.status(404).json({
        error: 'Not Found',
    });
});

module.exports.handler = serverless(app);
