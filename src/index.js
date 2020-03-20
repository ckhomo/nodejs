const express = require('express');
const url = require('url');
const bodyParser = require('body-parser');

const url_encoded_Parser = bodyParser.urlencoded({ extended: false });

var app = express();

// Setup view engine:
app.set('view engine', 'ejs');

//順序:由上而下。
//若有路徑衝突，會優先send上層之連結。

app.get('/try-qs', (req, res) => {
    const output = {
        url: req.url,
    };
    output.urlParts = url.parse(req.url, true);
    // res.json(output);
    res.json(output.urlParts);

});
// app.get('/try-post', (req, res) => {
//     res.render('try-post');
// });
app.post('/try-post', url_encoded_Parser, (req, res) => {
    // res.render('try-post', req.body);
    res.json(req.body);
});

// Link to designated pages.
app.get('/', (req, res) => {
    // res.send(`<h2>Hello Mr.Lee!</h2>`);
    res.render('home', { name: "ckhomo" });
});

app.get('/try', (req, res) => {
    res.send(`<h2>TRY THIS ROUTER.</h2>`);
});

app.get('/sales', (req, res) => {
    const data = require(__dirname + '/../data/sales');
    // res.send(`<h2>${data[0].name}</h2>`);
    res.render('sales', {
        sales: data
    });
});

// Static folder:
app.use(express.static("public"));

// Post error message.
app.use((req, res) => {
    res.type('text/html');
    res.status = 404;
    res.send(`
    path:${req.url}<br>
    <h2>404 - Data not found.</h2>
    `);
});

app.listen(5487, function () {
    console.log("Listening on port:5487.");
});