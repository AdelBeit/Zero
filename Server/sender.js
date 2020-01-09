const https = require('http');
const express = require('express');
const app = express();
const util = require('util');
const fs = require('fs');
const Readable = require('stream').Readable;
const Writeable = require('stream').Writable;
const port = 3000;

const server = https.createServer();

server.on('request', (request, response) => {
     response.writeHead(200, {
          "Content-Type": "text/html"
     });
     let url = request.url,
          method = request.method;

     if (method === 'GET') {

          if (url === '/alien') {
               (() => {

                    const postoptions = {
                         hostname: '73.225.252.218',
                         method: 'POST',
                         path: '/',
                         port: '3001'
                    };

                    const postrequest = https.request(postoptions, (response) => {
                         response.on('data', (data) => {
                              //
                              console.log('***** response: ' + data.toString());
                         });
                    });

                    postrequest.on('error', (error) => {
                         console.log('***** WE GOT AN ERROR');
                         console.error(error);
                         console.log();
                    });

                    const imageURL = "http://res.cloudinary.com/wkjhldh/image/upload/v1577089370/ki99h96epbw1xrqqqgch.jpg";

                    const getrequest = https.request(imageURL, (response) => {
                         response.on('data', (data) => {
                              console.log('sending data ****');
                              postrequest.write(data);
                         });
                    });

                    getrequest.on('error', (error) => {
                         console.error(error);
                    });

                    getrequest.end(() => {
                         postrequest.end();
                    });
                    
               })();

               response.write('<h1>Welcome to the bot homepage</h1>');
               response.end();
          }

          response.on('error', error => {
               response.writeHead(200);
               response.end(error);
          });
     }
});

server.listen(port, () => {
     console.log('Server listening on localhost:' + port);
});




// app.get('/', (request, response) => {
//      response.send('hello world');
// });

// app.get('/sendit', (request, response) => {
//      (() => {
//           // fetch image from server
//           function fetchImage(url) {
//                const options = {
//                     url: url,
//                     port: 443,
//                     method: 'GET'
//                };

//                const request = https.request(url, (response) => {
//                     response.chunks = [];

//                     const sendchunksoptions = {
//                          hostname: '73.225.252.218',
//                          method: 'post',
//                          path: '/',
//                          port: '3001'
//                     };

//                     response.on('data', (data) => {
//                          // process.stdout.write(data);
//                          // console.log(JSON.stringify(data));
//                          console.log(util.inspect(data));
//                          // response.chunks.push(data);

//                          stream.push(data);
//                          stream.pipe()
//                     });

//                     response.on('end', () => {

//                          stream.push(null);
//                          stream.pipe()

//                          const sendchunksoptions = {
//                               hostname: '73.225.252.218',
//                               method: 'post',
//                               path: '/',
//                               port: '3001'
//                          };

//                          const sendchunks = https.request(sendchunksoptions, (response) => {});

//                          sendchunks.on('error', (error) => {
//                               console.error(error);
//                               console.log();
//                          });

//                          sendchunks.end(JSON.stringify({
//                               done: true
//                          }));
//                     })
//                     // response.on('end', () => {
//                     //      console.log('* done');
//                     //      let b = Buffer.concat(response.chunks);

//                     //      fs.writeFile('image.png', b, (err) => {});
//                     //      // console.log(response.chunks.toString());
//                     // });

//                });

//                request.on('error', (error) => {
//                     console.error(error);
//                })

//                request.end();
//           }

//           const imageURL = "http://res.cloudinary.com/wkjhldh/image/upload/v1577089370/ki99h96epbw1xrqqqgch.jpg";

//           fetchImage(imageURL);
//      })();
// });

// app.listen(port, () => {
//      console.log('server listening on port ' + port);
// });

//         (() => {
//             // fetch image from server
//             function fetchImage(url){
//               const options = {
//                 url: url,
//                 port: 443,
//                 method: 'GET'
//               };

//               const request = https.request(url, (response) => {
//                 response.on('data', (data) => {
//                   process.stdout.write(data);
//                   console.log(typeof(data));
//                 });
//               });

//               request.on('error', (error) => {
//                 console.error(error);
//               })

//               request.end();
//             }

//             const imageURL = "http://res.cloudinary.com/wkjhldh/image/upload/v1577089370/ki99h96epbw1xrqqqgch.jpg";

//             fetchImage(imageURL);
//           })();

// const https = require('http');
// const port = process.env.PORT || 3000;
// const bot = require('../Bot/bot');

// const server = https.createServer();


// server.on('request', (request, response) => {
//     response.writeHead(200, {"Content-Type": "text/html"});
//     let url = request.url, 
//     method = request.method;

//     // store the request data for later processing
//     request.chunks = [];
//     request.on('data', chunk => {
//         request.chunks.push(chunk);
//     });

//     request.on('end', () => {
//         // if(method === 'POST'){
//         //     bot.response = response;
//         //     bot.request = request;
//         //     bot.respond();
//         //     response.end();
//         // }
//     });

//     if(method === 'GET'){




//     }

// });







// const sendchunksoptions = {
//      hostname: '73.225.252.218',
//      method: 'post',
//      path: '/',
//      port: '3001'
// };

// const sendchunks = https.request(sendchunksoptions, (response) => {
//      // response.on('data', (data2) => {
//      //      console.log(JSON.parse(data2).text);
//      // });
// });

// sendchunks.on('error', (error) => {
//      console.error(error);
//      console.log();
// });

// sendchunks.end(JSON.stringify({
//      data: data,
//      done: false
// }));

// const alarmoptions = {
//      hostname: '73.225.252.218',
//      method: 'post',
//      path: '/',
//      port: '3001'
// };
// const alarmreq = https.request(alarmoptions, (response) => {
//      response.on('data', (data) => {
//           process.stdout.write(data);
//      });
// });

// alarmreq.on('error', (error) => {
//      console.error(error);
//      console.log();
// });

// alarmreq.end(JSON.stringify({
//      text: 'ping'
// }));