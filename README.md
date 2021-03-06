# NodeJS Groupme Bot


## Description
Zero dependency Groupme bot in vanilla NodeJS

This was created to learn more about REST APIs, Servers, and HTTP requests. 

Uses a mixture of both callback functions and Promises to serve as an example for both styles. 

Inspired by the lack of thorough and complete code samples for HTTP routing and making API requests with NodeJS. All the other examples on the web use frameworks such as express or libraries such as request that make it difficult to learn about the basics of HTTP routing and Servers.

In order to use your own GroupMe bot with this code, go to https://dev.groupme.com/ and follow their guides to make your own bot then replace the credentials in this code with your own and have fun.

P.S. you can run the server on your localhost and use it as a callback url for your groupme bot to receive group chat messages, just gotta make sure to port forward your public IP with the port you will be using to run this server.


## Files

* /Utils/captionJIMP uses the JIMP library to caption images 

* /Utils/Cloudinary uses the Cloudinary API to caption images and temporarily store them to be uploaded to GroupMe servers

* /Utils/RequestOptions returns request options required to make the different HTTP requests to GroupMe API

* /Utils/Utils includes all the helper functions to perform the different tasks made possible by GroupMe API

* /Procfile Used for Heroku, if you don't use Heroku you can discard it


## Planned Features: 

* DB connection
 
* Text analytics


