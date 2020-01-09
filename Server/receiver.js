const https = require('http');
const express = require('express');
const app = express();
const util = require('util');
const fs = require('fs');
const port = 3001;

const server = https.createServer();
let chunks = [];
server.on('request', (request, response) => {
     response.writeHead(200, {"Content-Type": "text/html"});
     let method = request.method;

     response.on('error', error => {
          response.writeHead(200);
          response.end(error);
     });

     if(method === 'GET'){
          response.write('<h1>we out here</h1>');
     }

     if(method === 'POST'){
          request.on('data', chunk => {
               chunks.push(chunk);
          });

          request.on('end', () => {
               console.log('* post done');
               let b = Buffer.concat(chunks);
               fs.writeFile('image.png', b, (err) => {
                    response.write('image saved');
                    response.end();
               });
          });
     }
});

server.listen(port, () => {
     console.log('Server listening on localhost:'+port);
});

// app.get('/', (request, response) => {
//      response.send('hello world');
// });

// app.post('/', (request, response) => {
     
// });



// app.listen(port, () => {
//      console.log('server listening on port ' + port);
// });