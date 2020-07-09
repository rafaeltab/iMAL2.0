const express = require('express');
const app = express();

const port = process.env.PORT | 3000;
const hostname = process.env.HOST | "0.0.0.0";

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port,hostname, () => console.log(`Example app listening at ${hostname}:${port}`));