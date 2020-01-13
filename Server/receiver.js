const https = require('http');
const fs = require('fs');
const port = 3001;

// fs.stat('image.jpeg', (err, stat) => {console.log(stat)});

const server = https.createServer();
let chunks = [];

// handle https requests
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
          // get file type from headers
          const fileType = request.headers['content-type'].replace(/.+?\//, '.');
          console.log('******* THIS BE CONTENT LENGTH : ' + request.headers['content-length']);
          const imageStream = fs.createWriteStream('image'+fileType);
          // image data coming in 
          let counter = 0;
          request.pipe(imageStream);
          request.on('data', chunk => {
               // chunks.push(chunk);
               // console.log(chunk.toString());
               // if(chunk.toString() == " file ended boys"){
               //      response.end();
               // }
          });

          request.on('end', () => {
               response.end(JSON.stringify({text:'we got it all****'}));
               // console.log('****** THIS BE SAVED CONTENT LENGTH : ' + fs.Stats('image.jpeg'));
               // let b = Buffer.concat(chunks);
               // fs.writeFile('image.png', b, (err) => {
               //      response.write('image saved');
               //      response.end();
               // });
               imageStream.on('finish', () => {
                    imageStream.close(() => {
                         console.log('image saved *****');
                         response.end();
                    });
               });
          });
     }
});

server.listen(port, () => {
     console.log('Receiver listening on localhost:'+port);
});

// app.get('/', (request, response) => {
//      response.send('hello world');
// });

// app.post('/', (request, response) => {
     
// });



// app.listen(port, () => {
//      console.log('server listening on port ' + port);
// });