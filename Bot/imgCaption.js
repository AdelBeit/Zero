/* eslint-disable no-unused-vars */
// require('dotenv').config();
const https = require('https');
const jimp = require('jimp');
const randChars = require('./Utils').randChars;
const path = require('path');
const fs = require('fs');

let activeDir = './Assets/active/';
let exportDir = './Assets/export/';

const defaultFont = jimp.FONT_SANS_64_WHITE;

/**
 * Caption an image and return the path
 */
function caption(rawPath, caption){

  caption = {'text':caption};
  caption.x = 0,
  caption.y = 0;

  const fileName = randChars()+'.jpg';

  let rawDir = path.resolve(__dirname, rawPath);
  activeDir = path.resolve(__dirname, activeDir+fileName),
  exportDir = path.resolve(__dirname, exportDir+fileName);

  jimp.read(rawDir)
  .then(image => {image.clone().write(activeDir)})

  .then(() => {jimp.read(activeDir)

    .then(image => {
      jimp.loadFont(defaultFont).then(font => {

        let width = image.bitmap.width,
        height = image.bitmap.height;

        caption.x = width/12;
        caption.y = height/20;

        caption.maxWidth = width - (width/6);
        caption.maxHeight = height - (height/10);
        
        return image.print(
          font, 
          caption.x, 
          caption.y, 
          {
            text: caption.text,
            alignmentX: jimp.HORIZONTAL_ALIGN_CENTER,
            alignmentY: jimp.VERTICAL_ALIGN_BOTTOM
          }, 
          caption.maxWidth,
          caption.maxHeight
        );
      })
    
      .then(image => {image.quality(100).write(exportDir)})
      
      .then(image => {
        console.log('exported image: ' + exportDir);
        // cleanup
        fs.unlink(activeDir,error => {if(error) throw error});
        return exportDir;
      })
    })
  })

  .catch(error => {console.error(error)});
}

// const p = "./Assets/raw/spongebob.jpg";
// caption(p,"dUmDUm");

module.exports = {
  caption: caption
}


