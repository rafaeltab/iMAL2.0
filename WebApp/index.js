const express = require('express');
const app = express();

const port = process.env.PORT || 3000;
const hostname = "0.0.0.0";

app.get('/*', (req, res) => {
    
    let stringified = JSON.stringify(req.params);
    res.send(`${req.host}\n${stringified}`);
});

app.listen(port,hostname, () => console.log(`Example app listening at ${hostname}:${port}`));