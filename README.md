# NodeJS Groupme Bot
Zero dependency Groupme bot in vanilla NodeJS

This was created to aid in learning about REST APIs, Servers, and HTTP requests. 

Files:
     - /Utils/captionJIMP uses the JIMP library to caption images 
     - /Utils/Cloudinary uses the Cloudinary API to caption images and temporary store them to be uploaded to GroupMe servers.
     - /Utils/RequestOptions.js returns request options required to make the different HTTP requests to GroupMe API
     - /Utils/Utils includes all the helper functions to perform the different tasks made possible by GroupMe API
     - Procfile: Used for Heroku, if you don't use Heroku you can discard it

Uses a mixture of both callback functions and Promises to serve as an example for both styles. 

Inspired by the lack of thorough and complete code samples for HTTP routing and making API calls with NodeJS. All the other examlpes on the web use frameworks such as express or libraries such as request that make it difficult to learn about the basics of HTTP routing and Servers.