/* eslint-disable no-unused-vars */
'use strict';
const https = require('http');
const port = process.env.PORT || 3000;
const bot = require('./Bot');

const server = https.createServer();


server.on('request', (request, response) => {
    response.writeHead(200, {"Content-Type": "text/html"});
    let method = request.method;

    // store the request data for later processing
    request.chunks = [];
    request.on('data', chunk => {
        request.chunks.push(chunk);
    });

    request.on('end', () => {
        if(method === 'POST'){
            bot.response = response;
            bot.request = request;
            bot.respond();
            response.end("<h2>The bot has spoken</h2>");
        }
    });

    if(method === 'GET'){
        response.write('<h1>Well hello there little feller, are ya lost?</h1>');
        response.end();
    }

    response.on('error', error => {
        response.writeHead(200);
        response.end(error);
    });
});

server.listen(port, () => {
    console.log('Server listening on localhost:' + port);
});