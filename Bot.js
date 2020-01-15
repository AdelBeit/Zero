/* eslint-disable no-unused-vars */
'use strict';
const utils = require('./Utils/Utils');
const caption = require('./Utils/Cloudinary').caption;
const remove = require('./Utils/Cloudinary').remove;

const COMMANDS = [/mock/i, /show/i];
const BOTNAME = 'wire';

/**
 * Forms a response based on the given message
 */
function respond() {
	const request = JSON.parse(this.request.chunks[0]),
		nameCheck = new RegExp("@" + BOTNAME, 'im');

	let botResponse = "come again?";

	// if bot is mentioned
	if (request.text.match(nameCheck)) {
		if (request.text.match(COMMANDS[0])) {

			// sanitize the incoming message and use it as a response
			botResponse = request.text.replace(nameCheck, '')
				.replace(COMMANDS[0], '');

			this.response.writeHead(200);

			utils.sendMessage("Aight Chief");

			// caption an image with the text and post it
			mock(botResponse, () => {
				this.response.end();
			});

		} else {
			this.response.writeHead(200);
			this.response.end();
		}
	}
}

/**
 * Takes a string and randomizes the capitalization, then overlays it over an image and sends the image
 */
function mock(text) {

	// randomize capitaliztion 
	let newChar, i, coinFace,
		captionText = text.toLowerCase();
	for (i = 0; i < text.length; i++) {
		newChar = text.substr(i, 1);
		coinFace = Math.round(Math.random());
		if (coinFace) {
			newChar = newChar.toUpperCase();
		}
		captionText = captionText.substring(0, i);
		captionText += newChar;
		captionText += text.substring(i + 1);
	}

	// overlay the text over the image
	caption(captionText)
	// upload image to groupme server
	.then(image => {
		// cloudinary returns http link and groupme only accepts https
		// so change from http to https
		image.url = image.url.replace(/^http/,'https');

		utils.getImageURL(image.url)
		.then((groupmeURL) => {
			return utils.postImage(groupmeURL, "Here you go little feller");
		})
		.then((statusCode) => {
			if(statusCode == 202){
				remove(image.id, (error, result) => {
					if (error) throw error;
					return result;
				});
			}
		})
		.catch((error) => {if(error) throw error});
	})
	.catch((error) => {if(error) throw error});

}

module.exports = {
	respond: respond
}