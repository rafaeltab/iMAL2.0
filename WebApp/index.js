const app = require('express')();

const crypto = require('crypto');

const port = process.env.PORT || 3000;
const hostname = "0.0.0.0";

const client_id = process.env.CLIENT_ID || "nope";
const client_secret = process.env.CLIENT_SECRET || "nope"

function create_UUID(){
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}

function base64URLEncode(str) {
    return str.toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

let codeDict = {}

app.get('/log', (req,res) => {
    console.log(JSON.stringify(codeDict));
    res.send("ok");
});

//TODO better responses
app.get('/authed', (req, res) => {
    if((req.query.code == null || req.query.code == "" || req.query.status == null || req.query.status == "")){
        res.send("Something went wrong 0");
        return;
    }

    const codeRe = /^[\w]{64}$/;
    if(!req.query.code.match(codeRe)){
        res.send("Something went wrong 1");
        return;
    }
    const statusRe = /^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$/;
    if(!req.query.status.match(statusRe)){
        res.send("Something went wrong 2");
        return;
    }

    if(codeDict[req.query.status]){
        if(codeDict[req.query.status] != "pending"){
            res.send("Something went wrong 3");
            return;
        }
        
        codeDict[req.query.status] = req.query.code;
        //TODO redirect to the app
        res.redirect('imal://finished');
        return;
    }

    res.send("Something went wrong 4");
});

app.get('/startauth', (req, res) => {
    //create a code
    var randomCode = create_UUID();
    codeDict[randomCode] = "pending";
    //send client id    
    var verifier = base64URLEncode(crypto.randomBytes(96));

    let clienturl =`https://myanimelist.net/v1/oauth2/authorize?response_type=code&client_id=${client_id}&code_challenge=${verifier}&state=${randomCode}`
    
    res.send(clienturl);
});

app.get('/code', (req, res) => {
    //create a code
    var randomCode = create_UUID();
    res.send(randomCode);
});

app.get('/*', (req, res) => {
    
    let stringified = JSON.stringify(req.query);
    res.send(`${req.hostname}\n${stringified}`);
});

app.listen(port,hostname, () => console.log(`Example app listening at ${hostname}:${port}`));