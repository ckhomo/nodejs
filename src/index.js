const express = require('express');
const url = require('url');
// const bodyParser = require('body-parser');
const fs = require('fs');
const uuid = require('uuid');

const multer = require('multer');
const upload = multer({ dest: 'tmp_uploads/' });
const session = require('express-session');

//For fun.
// const Swal = require('sweetalert2');

// const url_encoded_Parser = bodyParser.urlencoded({ extended: false });

var app = express();
// Setup view engine:
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//SESSION setup:
app.use(session({
    saveUninitialized: false,
    resave: false,
    secret: 'do_svidaniya',
    cookie: {
        maxAge: 1000 * 60 * 20,
    }
}));

//順序:由上而下。
//若有路徑衝突，會優先send上層之連結。

//SESSION:
app.get('/try-session', (req, res) => {
    req.session.my_var = req.session.my_var || 0;
    req.session.my_var++;
    res.json({
        my_var: req.session.my_var,
        session: req.session
    });
});

//DO LOGIN(middleware):
app.use('/member', require(__dirname + '/route/member'));

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
app.get('/try-upload', (req, res) => {
    res.render('try-upload');
})
app.post('/try-upload', upload.single('avatar'), (req, res) => {
    console.log(req.file);
    const output = {
        body: req.body,
        file: req.file,
    };
    let filename = "";
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
            let filename = uuid.v4() + ext;
            output.newName = filename;
            fs.rename(
                req.file.path,
                './public/img/' + filename,
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
    //FOR: try-upload2,3.html
    res.json(output);

    //FOR: try-upload.ejs
    // res.render('try-upload', {
    //     result: true,
    //     name: output.file.originalname,
    //     // avatar: '/img/' + filename
    //     avatar: '/img/' + output.newName
    // });
});

// Router sol(1):
// const admin1 = require(__dirname+'/admin/admin1');
// admin1(app);
require(__dirname + '/admin/admin1')(app);

// Router sol(2):
app.use(require(__dirname + '/admin/admin2'));

//Router sol(3):
// module 裡面的路徑用相對路徑
app.use('/admin3', require(__dirname + '/admin/admin3'));

//Read json.
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