const express = require('express');
const url = require('url');
// const bodyParser = require('body-parser');
const fs = require('fs');
const uuid = require('uuid');

const multer = require('multer');
const upload = multer({ dest: 'tmp_uploads/' });

// const url_encoded_Parser = bodyParser.urlencoded({ extended: false });

var app = express();
// Setup view engine:
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

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

//POST表單:
app.get('/try-post', (req, res) => {
    res.render('try-post');
});
app.post('/try-post', (req, res) => {
    // res.render('try-post', req.body);
    res.json(req.body);
});

//Upload image:
// app.get('/try-upload', (req, res) => {
//     res.render('try-upload');
// })
app.post('/try-upload', upload.single('avatar'), (req, res) => {
    console.log(req.file);
    if (req.file && req.file.originalname) {
        let ext = '';
        switch (req.file.mimetype) {
            case "image/jpeg":
                ext = '.jpeg';
                break;
            case "image/png":
                ext = '.png';
                break;
            case "image/jpg":
                ext = '.jpg';
                break;
            case "image/gif":
                ext = '.gif';
                break;
        }
        if (ext) {
            let filemname = uuid.v4() + ext;
            fs.rename(
                req.file.path,
                './public/img/' + filemname,
                error => { }
            );
        } else {
            fs.unlink(req.file.path, error => { });
        }

        // if (/\.(jpg|jpeg|png|gif)$/i.test(req.file.originalname)) {
        //     fs.rename(req.file.path, './public/img/' + req.file.originalname, error => { });
        // } else {
        //     fs.unlink(req.file.path, error => { });
        // }
    };
    res.json({
        body: req.body,
        file: req.file
    });

    // res.render('try-upload', {
    //     result: true,
    //     name: req.body.name,
    //     avatar: '/img/' + req.file.originalname
    // });
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