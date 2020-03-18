// http_server.js
const http = require('http');
const server = http.createServer((request, response) => {
    response.writeHead(200, {
        'Content-Type': 'text/html; charset="utf-8"'
    });
    response.end(`<div>Hello, YU_LI here.</div>
                  <div>こんにちは。こちらはYU_LIです。</div>
                  <div>Здравствуй, здесь YU_LI.</div><br>
${request.url}
</div>`);
});
server.listen(9487);