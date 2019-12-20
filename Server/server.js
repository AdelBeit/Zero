const https = require('http');
const port = process.env.PORT || 3000;
const bot = require('../Bot/bot');

const server = https.createServer();

server.on('request', (request, response) => {
    response.writeHead(200, {"Content-Type": "text/html"});
    let url = request.url, 
    method = request.method;

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
            response.end();
        }
    });

    if(method === 'GET'){
        response.write('<h1>Welcome to the bot homepage</h1>');
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
