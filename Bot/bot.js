/* eslint-disable no-unused-vars */
// require('dotenv').config();
const https = require('https');
const fs = require('fs');
const reqOptions = require('./reqOptions');

const TOKEN = process.env.TOKEN;
const GROUPID = process.env.GROUPID;
const BOTID = process.env.BOTID;
const BOTID2 = process.env.NOCALLBACKBOT;
const HOSTNAME = "api.groupme.com";

// returns all groupIDs in a JSON format
function getGroupID(){
  const options = reqOptions.getOptions("groupID");
  console.log(options);
  const req = https.request(options, (res) => {
    res.on('data', (d) => {
      // d is the response of the request
      process.stdout.write(d);
    });
  });

  req.on('error', (e) => {
    console.error(e);
    console.log();
  });
  
  req.end();
}

// takes a botName and creates a bot for the group id specified in your environment varaibles file
function makeBot(botName="Alpha",callbackURL=null,avatarURL=null){
  const options = reqOptions.getOptions("makeBot");
  const req = https.request(options, (res) => {
    res.on('data', (d) => {
      // d is the response of the request
      process.stdout.write(d);
    });
  });
  
  req.on('error', (e) => {
    console.error(e);
    console.log();
  });
  
  const body = JSON.stringify({
    name: botName,
    group_id: GROUPID,
    callback_url: callbackURL,
    avatar_url: avatarURL
  });

  req.end(body);
}

function sendMessage(message) {
  const options = reqOptions.getOptions("messagePost");
  const req = https.request(options, (res) => {
      res.on('data', (d) => {
          // d is the response of the request
          process.stdout.write(d);
      });
  });

  req.on('error', (e) => {
      console.error(e);
      console.log();
  });

  const body = JSON.stringify({
      text: message,
      bot_id: BOTID
  });

  req.end(body);
}

function sendLocation(longitude=40,latitude=70,name="Monsters Inc",type="location",text="Let's go there"){
  const loc = {
    type: type,
    lng: longitude,
    lat: latitude,
    name: name
  };
  const options = reqOptions.getOptions("locationPost");
  const req = https.request(options, (res) => {
    res.on('data', (d) => {
      // d is the response of the request
      process.stdout.write(d);
    });
  });
  
  req.on('error', (e) => {
    console.error(e);
    console.log();
  });
  
  const body = JSON.stringify({
    bot_id: BOTID,
    text: text,
    attachments: [loc]
  })

  req.end(body);
}

// upload an image to groupme servers and grab url
function getImageURL(imageFileName){
  const options = reqOptions.getOptions("imageUpload");
  // upload the image with this request
  const req = https.request(options, (res) => {
    res.on('data', (d) => {
      // process.stdout.write(d);
      // grab the url from the response
      let url = JSON.parse(d.toString()).payload.picture_url;
      // post the image to the chat using a new request
      postImage(url);
    });
  });
  
  req.on('error', (e) => {
    console.error(e);
    console.log();
  });
  
  // read the image file and send the data as the req body
  fs.readFile(imageFileName, (err, data) => {
    if (err) throw err;
    req.end(data);
  });
}

// post the image on the chat
function postImage(url,text="Look at this cute pic I found"){
  const options = reqOptions.getOptions("imagePost");
  const req = https.request(options, (res) => {
    res.on('data', (d) => {
      process.stdout.write(d);
    });
  });
  
  req.on('error', (e) => {
    console.error(e);
    console.log();
  });
  
  const body = JSON.stringify({
    bot_id: BOTID,
    text: text,
    attachments: [{
      type: "image",
      url: url
    }]
  });
  req.end(body);
}

// send an image (accepts .png/.jpeg/.jpg)
function sendImage(imageFileName="./assets/image.jpg"){
  getImageURL(imageFileName);
}

// getGroupID();
// makeBot("Wire","https://desolate-springs-47892.herokuapp.com");
// sendMessage("Gonna be AFK for a second");
// sendLocation();
// sendImage();
console.log('ran');

// -----------  temporarily housing  ------------

// router code
// const url = require('url');

// const router = (req,res) => {

//   req.requrl = url.parse(req.url, true);
//   const path = req.requrl.pathname;
//   const method = req.method;
  

//   // default message to send
//   if(method == 'GET'){
//     console.log("got something");
//     sendMessage("AYYYYY TOUGH GUY");
//   }

//   // upon being summoned do something
//   if(method == 'POST'){
//     console.log("post something");
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/html');
    
//     const incommingMessage = JSON.parse(req.chunks[0]),
//     summonRegex = /^!wire/g;
//     if(incommingMessage.text && summonRegex.test(incomingMessage.text)){
//       // sendImage();
//     }
//     else {
//       // sendMessage("don't care");
//     }

//     res.on('error', (e) => {
//       console.error(e);
//       console.log();
//     });

//     res.end(incomingMessage+"\n");
//   }

//   res.on('error', (e) => {
//     console.error(e);
//     console.log();
//   });

//   res.end("nothing new here\n");
// }

// // server code
// const serverPort = process.env.PORT || 3000;
// const serverHostname = process.env.HOSTNAME || "localhost";
// const server = https.createServer();

// server.on('request', (req, res) => {
//   router(req,res);
//   // res.statusCode = 200;
//   // res.setHeader('Content-Type', "text/html");
//   // res.end('you dropped something\n');
// });

// server.listen(serverPort,serverHostname, () => {
//   console.log(`Server running at http://${serverHostname}:${serverPort}/`);
// });
