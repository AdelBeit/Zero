/* eslint-disable no-unused-vars */
// require('dotenv').config();
const https = require('https');
const jimp = require('jimp');
const randChars = require('./Utils').randChars;

let activeDir = './Assets/active/';
let exportDir = './Assets/export/';

/**
 * Caption an image and return the path
 */
function caption(rawPath, caption){
  caption.text = caption,
  caption.x = 10,
  caption.y = 20,
  caption.maxWidth = 200,
  caption.maxHeight = 300;
  const name = randChars()+'.jpg';
  jimp.read(rawPath)
  .then(image => {image.clone().write(activeDir+name)})

  .then(() => {jimp.read(activeDir+name)})

  .then(image => {jimp.loadFont(jimp.FONT_SANS_32_WHITE).then(font => {[image,font]})})

  .then(data => {
    let image = data[0], font = data[1];

    return image.print(font, caption.x, caption.y, {
      text: caption.text,
      alignmentX: jimp.HORIZONTAL_ALIGN_CENTER,
      alignmentY: jimp.VERTICAL_ALIGN_BOTTOM
    }, caption.maxWidth, caption.maxHeight);
  })

  .then(image => {image.quality(100).write(exportDir+name)})
  
  .then(image => {console.log('exported image: ' + exportDir+name)})

  .catch(error => {console.error(error)});
}

const p = "./Assets/raw/spongebob.jpg";
caption(p,"I like pizza");

module.exports = {
  caption: caption
}