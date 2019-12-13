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

/**
 * Returns all group IDs, for the given token env variable, in a JSON format
 */
function getGroupID(){
  const options = reqOptions.getOptions("groupID");
  const request = https.request(options, (reponse) => {
    // listen for responses with payloads
    reponse.on('data', (data) => {
      process.stdout.write(data);
    });
  });

  request.on('error', (error) => {
    console.error(error);
    console.log();
  });
  
  request.end();
}

/**
 * Makes a new bot in the given group, specified by the groupid env
 * var, with the given params
 */
function makeBot(botName="Alpha",callbackURL=null,avatarURL=null){
  const options = reqOptions.getOptions("makeBot");
  const request = https.request(options, (reponse) => {
    reponse.on('data', (data) => {
      process.stdout.write(data);
    });
  });
  
  request.on('error', (error) => {
    console.error(error);
    console.log();
  });
  
  // parameters required to make a groupme bot
  // callback url points to a webserver that can receive messages 
  // that are sent to the group
  const body = JSON.stringify({
    name: botName,
    group_id: GROUPID,
    callback_url: callbackURL,
    avatar_url: avatarURL
  });

  // send the body of the request over as you end the request
  request.end(body);
}

/**
 * Sends a message to the group based on the bot 
 */
function sendMessage(message) {
  const options = reqOptions.getOptions("messagePost");
  const request = https.request(options, (reponse) => {
    // listen for responses with payloads
    reponse.on('data', (data) => {
      process.stdout.write(data);
    });
  });
  
  request.on('error', (error) => {
    console.error(error);
    console.log();
  });

  const body = JSON.stringify({
      text: message,
      bot_id: BOTID
  });

  request.end(body);
}

/**
 * Send a location
 */
function sendLocation(longitude=40,latitude=70,name="Monsters Inc",type="location",text="Let's go there"){
  const location = {
    type: type,
    lng: longitude,
    lat: latitude,
    name: name
  };
  const options = reqOptions.getOptions("locationPost");
  const request = https.request(options, (response) => {
    response.on('data', (data) => {
      // data is the response of the request
      process.stdout.write(data);
    });
  });
  
  request.on('error', (e) => {
    console.error(e);
    console.log();
  });
  
  const body = JSON.stringify({
    bot_id: BOTID,
    text: text,
    attachments: [location]
  })

  request.end(body);
}

/** 
 * Upload an image to groupme servers and grab url
 */
function getImageURL(imageFileName){
  // upload the image
  const options = reqOptions.getOptions("imageUpload");
  const request = https.request(options, (response) => {
    response.on('data', (data) => {
      // grab the url from the response
      let url = JSON.parse(data.toString()).payload.picture_url;
      // post the image to the chat
      postImage(url);
    });
  });
  
  request.on('error', (error) => {
    console.error(error);
    console.log();
  });
  
  // read the image file and send the data as the req body
  fs.readFile(imageFileName, (error, data) => {
    if (error) throw error;
    request.end(data);
  });
}

/**
 * Post the image on the chat
 */
function postImage(url,caption="Look at this cute pic I found"){
  const options = reqOptions.getOptions("imagePost");
  const request = https.request(options, (response) => {
    response.on('data', (data) => {
      process.stdout.write(data);
    });
  });
  
  request.on('error', (error) => {
    console.error(error);
    console.log();
  });
  
  const body = JSON.stringify({
    bot_id: BOTID,
    text: caption,
    attachments: [{
      type: "image",
      url: url
    }]
  });
  request.end(body);
}

/**
 * Send an image (accepts .png/.jpeg/.jpg)
 */
function sendImage(imageFileName="./assets/image.jpg"){
  getImageURL(imageFileName);
}

function main(){
  // getGroupID();
  // makeBot("Wire","https://desolate-springs-47892.herokuapp.com");
  // sendMessage("Gonna be AFK for a second");
  // sendLocation();
  // sendImage();
}

/**
 * generator a string of random chars
 */
function randChars(len=10){
  const alphabet = 'abcde12345';
  let word = '',
  index = 0;
  for(let i=0;i<len;i++){
    index = Math.floor(Math.random()*alphabet.length);
    word+=alphabet.substring(index,index+1);
  }
  return word;
}

module.exports = {
  getGroupID: getGroupID,
  makeBot: makeBot,
  sendMessage: sendMessage,
  sendLocation: sendLocation,
  getImageURL: getImageURL,
  postImage: postImage,
  sendImage: sendImage,
  randChars: randChars
}