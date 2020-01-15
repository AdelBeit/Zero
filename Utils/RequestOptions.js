/* eslint-disable no-unused-vars */
'use strict';
const TOKEN = process.env.TOKEN,
HOSTNAME = "api.groupme.com";

/**
 * reqType: groupID, makeBot, messagePost, locationPost imageUpload, imagePost
 * 
 * returns appropriate http request options and headers 
 * based on the given request type
 */
function getOptions(reqType){
    const options = {};

    options.hostname = HOSTNAME;
    options.method = 'POST';

    switch(reqType){
        case "groupID":
            options.path = '/v3/groups?token=' + TOKEN;
            options.method = 'GET';
            break;
        case "makeBot":
            options.path = '/v3/bots?token=' + TOKEN;
            options.headers = {
                'X-Access-Token' : TOKEN,
                'Content-Type': 'text/json'
            };
            break;
        case "messagePost":
            options.path = '/v3/bots/post';
            break;
        case "locationPost":
            options.path = '/v3/bots/post';
            break;
        case "imageUpload":
            options.hostname = "image.groupme.com";
            options.path = '/pictures';
            options.headers = {
                'X-Access-Token': TOKEN,
                'Content-Type': 'image/jpeg'
            };
            break;
        case "imagePost":
            options.path = '/v3/bots/post';
            break;
        default:
            break;
    }

    return options;
}

exports.getOptions = getOptions;