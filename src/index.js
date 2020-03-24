const express = require('express');
const url = require('url');
// const bodyParser = require('body-parser');
const fs = require('fs');
const uuid = require('uuid');

const multer = require('multer');
const upload = multer({ dest: 'tmp_uploads/' });
const session = require('express-session');

// const moment = require('moment');
const moment = require('moment-timezone');

//Include db_connect.
const db = require(__dirname + '/db_connect');

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

//Middleware(Login check):
app.use((req, res, next) => {
    if (req.session.LoginUser) {
        res.locals.LoginUser = req.session.LoginUser;
    } else {
        res.locals.LoginUser = {};
    }
    next();
})

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
app.get('/sess', (req, res) => {
    res.json(req.session);
});

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

//moment.js:
app.get('/try-moment', (req, res) => {
    const fm = 'YYYY-MM-DD HH:mm:ss';
    const mo1 = moment(req.session.cookie.expires);
    const mo2 = moment(new Date());
    const mo3 = moment('2020-02-18');
    res.json({
        'local-mo1': mo1.format(fm),
        'local-mo2': mo2.format(fm),
        'local-mo3': mo3.format(fm),
        'london-mo1': mo1.tz('Europe/London').format(fm),
        'london-mo2': mo2.tz('Europe/London').format(fm),
        'london-mo3': mo3.tz('Europe/London').format(fm),
    });

});

//Show MySQL database:
app.get('/sales_sql', (req, res) => {

    //UPDATE:
    // var sql = 'UPDATE ADDRESS_BOOK SET NAME=?, EMAIL=? WHERE SID=2';
    // db.query(sql, ['馬英九', 'tw689@gmail.com'], (error, result) => {
    //     // if (error) throw error;
    //     if (error) {
    //         console.log(error);
    //     } else {
    //         console.log(result);
    //     }
    //     res.json(result);
    // })

    //SELECT:
    var sql = 'SELECT * FROM ADDRESS_BOOK';
    db.query(sql, (error, result, field) => {
        // if (error) throw error;
        if(error){
            console.log(error);
        }else{
            console.log(result, field);
        }
        for (let v of result) {
            v.birthday2 = moment(v.birthday).format('YYYY-MM-DD');
            v.created_at2 = moment(v.created_at).format('YYYY-MM-DD');
        }
        res.render('sales_sql', {
            addr_book: result
        });
    })
});
//MySQL: CRUD
app.use('/addr_book', require(__dirname +'/route/addr_book'));

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