const https = require('http');
const port = process.env.PORT || 3000


const server = https.createServer( (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end("Good bye\n");
});

server.listen(3000, () => {
    console.log("Server is running at " + port)
});
