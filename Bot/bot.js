/* eslint-disable no-unused-vars */
require('dotenv').config();
const https = require('https');
const fs = require('fs');

const TOKEN = process.env.TOKEN;
const GROUPID = process.env.GROUPID;
const BOTID = process.env.BOTID;
const PORT = 443;
const HOSTNAME = "api.groupme.com";

let getGroupIDReq = () => {
  return {
    options: {
      hostname: HOSTNAME,
      port: PORT,
      path: '/v3/groups?token=' + TOKEN,
      method: 'GET'
    }
  }
};

// returns all groupIDs in a JSON format
function getGroupID(){
  const req = https.request(getGroupIDReq().options, (res) => {
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

let makeBotReq = (botName,callbackURL,avatarURL) => {
  return {
    options: {
      hostname: HOSTNAME,
      port: PORT,
      path: '/v3/bots?token=' + TOKEN,
      method: 'POST',
      headers: {
        'X-Access-Token': TOKEN,
        'Content-Type': 'text/json'
      }
    },
    body: {
      bot: {
        name: botName,
        group_id: GROUPID,
        callback_url: callbackURL,
        avatar_url: avatarURL
      }
    }
  }
};

// takes a botName and creates a bot for the group id specified in your environment varaibles file
function makeBot(botName="Alpha",callbackURL=null,avatarURL=null){
  const req = https.request(makeBotReq(botName,callbackURL,avatarURL).options, (res) => {
    res.on('data', (d) => {
      // d is the response of the request
      process.stdout.write(d);
    });
  });
  
  req.on('error', (e) => {
    console.error(e);
    console.log();
  });
  
  req.end(JSON.stringify(makeBotReq(botName,callbackURL,avatarURL).body));
}

let sendMessageReq = (text = "PIZZA") => {
  return {
    options: {
      hostname: HOSTNAME,
      port: PORT,
      path: '/v3/bots/post',
      method: 'POST'
    },
    body: {
      text: text,
      bot_id: BOTID
    }
  }
};

function sendMessage(message){
  const req = https.request(sendMessageReq(message).options, (res) => {
    res.on('data', (d) => {
      // d is the response of the request
      process.stdout.write(d);
    });
  });

  req.on('error', (e) => {
    console.error(e);
    console.log();
  });
  
  req.end(JSON.stringify(sendMessageReq(message).body));
}

let sendLocationReq = (loc,text) => {
  return {
    options: sendMessageReq().options,
    body: {
      bot_id: BOTID,
      text: text,
      attachments: [{
        type: loc.type,
        lng: loc.lng,
        lat: loc.lat,
        name: loc.name
      }]
    }
  }
};

function sendLocation(longitude=40,latitude=70,name="Monsters Inc",type="location",text=""){
  const loc = {
    type: type,
    lng: longitude,
    lat: latitude,
    name: name
  };
  const req = https.request(sendLocationReq(loc,text).options, (res) => {
    res.on('data', (d) => {
      // d is the response of the request
      process.stdout.write(d);
    });
  });
  
  req.on('error', (e) => {
    console.error(e);
    console.log();
  });
  
  req.end(JSON.stringify(sendLocationReq(loc,text).body));
}

let ImageURLReq = () => {
    return {
    options: {
      hostname: 'image.groupme.com',
      port: PORT,
      path: '/pictures',
      method: 'POST',
      headers: {
        'X-Access-Token': TOKEN,
        'Content-Type': 'image/jpeg'
      }
    }
  };
};

// upload an image to groupme servers and grab url
function getImageURL(imageFileName){
  // upload the image with this request
  const req = https.request(ImageURLReq().options, (res) => {
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

let postImageReq = (url,text,type="image") => {
  return {
    options: sendMessageReq().options,
    body: {
      bot_id: BOTID,
      text: text,
      attachments: [{
        type: type,
        url: url
      }]
    }
  }
};

// post the image on the chat
function postImage(url,text="Look at this cute pic I found"){
  const req = https.request(postImageReq(url,text).options, (res) => {
    res.on('data', (d) => {
      process.stdout.write(d);
    });
  });
  
  req.on('error', (e) => {
    console.error(e);
    console.log();
  });
  
  req.end(JSON.stringify(postImageReq(url,text).body));
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
const url = require('url');
const router = (req,res) => {
  req.requrl = url.parse(req.url, true);
  const path = req.requrl.pathname;
  const method = req.method;
  
  // default message to send
  if(method == 'GET'){
    sendMessage("AYYYYY TOUGH GUY");
  }

  // upon being summoned do something
  if(method == 'POST'){
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    
    const incommingMessage = JSON.parse(req.chunks[0]),
    summonRegex = /^!wire/g;
    if(incommingMessage.text && summonRegex.test(incomingMessage.text)){
      sendImage();
    }
    else {
      sendMessage("don't care");
    }

    res.end(incomingMessage+"\n");
  }

  res.on('error', (e) => {
    console.error(e);
    console.log();
  });

  res.end("nothing new here\n");
}

// server code
const serverPort = process.env.PORT || 3000;
const serverHostname = process.env.HOSTNAME || "localhost";
const server = https.createServer();

server.on('request', (req, res) => {
  router(req,res);
});

server.listen(serverPort,serverHostname, () => {
  console.log(`Server running at http://${serverHostname}:${serverPort}/`);
});