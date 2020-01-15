/* eslint-disable no-unused-vars */
'use strict';
const https = require('https');
const reqOptions = require('./RequestOptions');


const GROUPID = process.env.GROUPID,
	BOTID = process.env.BOTID;

/**
 * Returns all group IDs, for the given token env variable, in a JSON format
 */
function getGroupID() {
	const options = reqOptions.getOptions("groupID");
	const request = https.request(options, (reponse) => {
		// listen for responses with payloads
		reponse.on('data', (data) => {
			process.stdout.write(data);
		});
	});

	request.on('error', throwError);

	request.end();
}

/**
 * Makes a new bot in the given group, specified by the groupid env
 * var, with the given params
 */
function makeBot(botName = "Alpha", callbackURL = null, avatarURL = null) {
	const options = reqOptions.getOptions("makeBot");
	const request = https.request(options, (reponse) => {
		reponse.on('data', (data) => {
			process.stdout.write(data);
		});
	});

	request.on('error', throwError);

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

	request.on('error', throwError);

	const body = JSON.stringify({
		text: message,
		bot_id: BOTID
	});

	request.end(body);
}

/**
 * Send a location
 */
function sendLocation(longitude = 40, latitude = 70, name = "Monsters Inc", type = "location", text = "Let's go there") {
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

	request.on('error', throwError);

	const body = JSON.stringify({
		bot_id: BOTID,
		text: text,
		attachments: [location]
	})

	request.end(body);
}

/** 
 * Upload an image to groupme servers using the image url
 * 
 * returns the generated url
 */
function getImageURL(imageURL) {
	
	return new Promise((resolve, reject) => {

		// download the image from the url
		const getImageRequest = https.request(imageURL, (getImageResponse) => {

			// upload the image to groupme
			const options = reqOptions.getOptions("imageUpload");
			const groupmeServerRequest = https.request(options, (groupmeServerResponse) => {

				groupmeServerResponse.on('data', (data) => {
					// grab the url from the response
					let groupmeURL = JSON.parse(data.toString()).payload.picture_url;
					
					resolve(groupmeURL);
				});
			});

			groupmeServerRequest.on('error', (error) => {if (error) reject(error)});

			// send over the image as it comes in from the get request
			getImageResponse.pipe(groupmeServerRequest);

			getImageResponse.on('end', () => {
				groupmeServerRequest.end();
			});
		});

		getImageRequest.on('error', (error) => {if (error) reject(error)});

		getImageRequest.end();
	});

}

/**
 * Post a groupme hosted image to the chat using its URL
 * 
 * requires: BOTID to be pre-defined
 */
function postImage(groupmeURL, message = "") {
	return new Promise((resolve, reject) => {
		const options = reqOptions.getOptions("imagePost");
		const request = https.request(options, (response) => {
			response.on('data', (data) => {});
			response.on('end', () => {
				resolve(response.statusCode);
			});
		});

		request.on('error', (error) => {if (error) reject(error)});
		
		const body = JSON.stringify({
			bot_id: BOTID,
			text: message,
			attachments: [{
				type: "image",
				url: groupmeURL
			}]
		});
		request.end(body);
	});
}

function throwError(error){
	if(error) throw error;
}

function basicTests() {
	// getGroupID();
	// makeBot("Wire","https://desolate-springs-47892.herokuapp.com");
	// sendMessage("Gonna be AFK for a second");
	// sendLocation();
	// sendImage();
	// getImageURL('../Assets/raw/alien.jpg','caption');
	// const rawImgURL = "https://res.cloudinary.com/wkjhldh/image/upload/v1577089370/ki99h96epbw1xrqqqgch.jpg";
	// let groupmeURL = 'https://i.groupme.com/1200x843.jpeg.905abb10ae544dd0a4d7a475826f78dd';
	// getImageURL(rawImgURL, "this here is a message sonny", postImage);
	// postImage(groupmeURL, 'Trains are just busses in a row');
}

module.exports = {
	getGroupID: getGroupID,
	makeBot: makeBot,
	sendMessage: sendMessage,
	sendLocation: sendLocation,
	getImageURL: getImageURL,
	postImage: postImage
}