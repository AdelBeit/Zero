/**
 * Caption an image using the Cloudinary API
 */

/* eslint-disable no-unused-vars */
'use strict';
const cloudinary = require('cloudinary').v2;

// default image
const IMAGE_URL = 'https://res.cloudinary.com/wkjhldh/image/upload/v1579343066/raw/test2_dohhkl.jpg';

let CLOUD_NAME = process.env.CLOUD_NAME,
API_KEY = process.env.API_KEY,
API_SECRET = process.env.API_SECRET;

cloudinary.config({
     cloud_name:CLOUD_NAME,
     api_key: API_KEY,
     api_secret: API_SECRET
});


/**
 * Captions an image given an image URL and a text to caption the image with, then stores it in cloudinary
 * Returns the URL of the image along with its ID for postprocessing
 */
function caption(caption, imageURL=IMAGE_URL, tags="mockery"){
     return new Promise((resolve, reject) => {
          const options = 
          {
               tag: tags,
               transformation: 
               [{
                    width: 400,
                    overlay: 
                    {
                         font_family: "Times",
                         font_size: 64,
                         text: caption
                    },
                    gravity: "south",
                    y: 20,
                    color: "white",
                    crop: "fit"
               }]
          }

          cloudinary.uploader.upload(imageURL, options)

          .then(image => {
               console.log("* " + image.public_id);
               console.log("* " + image.url);
               resolve({
                    url:image.url,
                    id:image.public_id
               });
          })

          .catch(error => {if (error) throw error});
     });
}

/**
 * Delete an asset from cloudinary after it's been used
 */
function remove(publicID){

     cloudinary.uploader.destroy(publicID)

     .then(response => {
          console.log(response);
     })
     .catch(error => {if (error) throw error});
}

function basicTesting(){
     caption("testing")
     .then(image => {
          remove(image.id, (error, result) => {
               if (error) throw error;
               return result;
          })
     })
     .catch((error) => {if(error) throw error});
}

module.exports = {
     caption: caption,
     remove: remove
}