// http_server2.js
const http = require('http'),
    fs = require('fs');
const server = http.createServer((request, response) => {
    fs.writeFile(
        __dirname + '/../data/headers.json',
        JSON.stringify(request.headers),
        (error) => {
            if (error) {
                console.log('ERROR!');
                response.end('error');
            } else {
                console.log('OK!');
                response.end('ok');
            }
        }
    )
})
server.listen(3000);