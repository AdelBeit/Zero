const https = require('https');
const cloudinary = require('cloudinary').v2;

const IMAGE_URL = 'https://github.com/AdelBeit/Groupme-Bot-NodeJS/raw/heroku/Bot/Assets/raw/spongebob.jpg',
CLOUD_NAME = process.env.CLOUD_NAME,
API_KEY = process.env.API_KEY,
API_SECRET = process.env.API_SECRET;
cloudinary.config({
     cloud_name:CLOUD_NAME,
     api_key: API_KEY,
     api_secret: API_SECRET
})

const options= 
{
     tags: "image1",
     transformation: 
     [{
          width: 400,
          overlay: 
          {
               font_family: "Times",
               font_size: 64,
               text: "Whatup boys"
          },
          gravity: "south",
          y: 20,
          color: "white",
          crop: "fit"
     }]
}


cloudinary.uploader.upload(IMAGE_URL, options)

.then(image => {
     console.log();
     console.log("* " + image.public_id);
     console.log("* " + image.url);
})

.catch(error => {if (error) console.error(error)});