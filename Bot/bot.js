/* eslint-disable no-unused-vars */
// require('dotenv').config();
const https = require('https');
const fs = require('fs');
const reqOptions = require('./reqOptions');
const utils = require('./Utils');

const TOKEN = process.env.TOKEN;
const GROUPID = process.env.GROUPID;
const BOTID = process.env.BOTID;
const BOTID2 = process.env.NOCALLBACKBOT;
const HOSTNAME = "api.groupme.com";
const COMMANDS = [/mock/i];
const BOTNAME = 'wire';

/**
 * Forms a response based on the given message
 */
function respond(){
  const request = JSON.parse(this.request.chunks[0]),
  nameCheck = new RegExp("@" + BOTNAME,'im');
  let botResponse = "what the hell you talking about boy";

  if(request.text.match(nameCheck)){
    if(request.text.match(COMMANDS[0])){
      botResponse = request.text.replace(nameCheck,'').replace(COMMANDS[0],'');
      this.response.writeHead(200);
      botResponse = mockery(botResponse);
      utils.sendMessage(botResponse);
      this.response.end();
    } else{
      this.response.writeHead(200);
      utils.sendMessage(botResponse);
      this.response.end();
    }
  }
}

/**
 * Returns the given string with the capitalization of the individual letters randomized
 */
function mockery(string){
  let newChar, i, coinFace,
  newString = string.toLowerCase();
  for(i = 0; i < string.length; i++){
    newChar = string.substr(i,1);
    coinFace = Math.round(Math.random());
    if(coinFace){
      newChar = newChar.toUpperCase();
    }
    newString = newString.substring(0,i);
    newString += newChar;
    newString += string.substring(i+1);
  }
  return newString;
}

module.exports = {
  respond: respond
}