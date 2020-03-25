/*
baseUrl:  /address-book

CRUD:
    Create (insert)
        get:  /add
        post: /add (...)

    Update
        get:  /edit/:sid
        post: /edit/:sid (...)

    Delete
        post: /delete/:sid

    Read
        get: /:page/:category?
 */


//Change page API:
const express = require('express');
const db = require(__dirname + '/../db_connect');
const upload = require(__dirname + '/../upload');
const router = express.Router();

//Middleware: add title
router.use((req, res, next) => {
    res.locals.title = 'Address book';
    next();
});

router.get('/add', (req, res) => {
    res.render('addr_book/add');
});

// upload.none() 用來解析 multipart/form-data 格式的 middleware
router.post('/add', upload.none(), (req, res) => {
    const output = {
        success: false,
        error: '',

    };

    //TODO: check input form-data
    if (req.body.name.length < 2) {
        output.error = '姓名字元長度太短';
        return res.json(output);
    };

    const email_pattern = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    if (!email_pattern.test(req.body.email)) {
        output.error = 'Email 格式錯誤';
        return res.json(output);
    };

    var today = new Date();
    req.body.created_at = today;
    const sql = "INSERT INTO `address_book` SET ?";
    db.queryAsync(sql, req.body)
        .then(results => {
            output.results = results;
            if (results.affectedRows === 1) {
                output.success = true;
            } res.json(output);
        })
        .catch(ex => {
            console.log('ex:', ex);
        })

});

const moment = require('moment-timezone');

router.get('/:page?', (req, res) => {
    const perPage = 3;
    let page = parseInt(req.params.page) || 1;
    const output = {
        totalRows: 0, // 總筆數
        perPage: perPage, // 每一頁最多幾筆
        totalPages: 0, //總頁數
        page: page, // 用戶要查看的頁數
        rows: 0, // 當頁的資料
    };
    const t_sql = "SELECT COUNT(1) num FROM ADDRESS_BOOK";

    db.queryAsync(t_sql)
        .then(results => {
            output.totalRows = results[0].num;
            output.totalPages = Math.ceil(output.totalRows / perPage);
            if (output.page < 1) output.page = 1;
            if (output.page > output.totalPages) output.page = output.totalPages;
            const sql = `SELECT * FROM address_book ORDER BY sid DESC LIMIT ${(output.page - 1) * output.perPage}, ${output.perPage}`;
            return db.queryAsync(sql);
        })
        .then(results => {
            for (let i of results) {
                i.birthday = moment(i.birthday).format('YYYY-MM-DD');
            };
            output.rows = results;
            // res.json(output);
            res.render('addr_book/list', output);
        })
        .catch(ex => {

        });

    // db.query(t_sql, (error, results) => {
    //     output.totalRows = results[0].num;
    //     output.totalPages = Math.ceil(output.totalRows / perPage);
    //     if (output.page < 1) output.page = 1;
    //     if (output.page > output.totalPages) output.page = output.totalPages;      

    //     const sql = `SELECT * FROM ADDRESS_BOOK LIMIT 
    //     ${(output.page-1)*output.perPage}, ${(output.perPage)}`;

    //     db.query(sql, (error,result)=>{
    //         output.rows = result;
    //         res.json(output);
    //     })
    // });
});

router.get('/delete/:sid?', (req, res) => {
    const sql = 'DELETE FROM ADDRESS_BOOK WHERE sid=?';
    db.queryAsync(sql, [req.params.sid])
        .then(results => {
            if (req.get("Referrer")) {
                res.redirect(req.get('Referrer'));
            } else {
                res.redirect('/addr_book');
            };
        }).catch(ex => {
            console.log('ex:', ex);
            res.json({
                success: false,
                info: '無法刪除資料'
            });
        });
});

router.get('/edit/:sid', (req, res) => {
    const sql = 'SELECT * FROM ADDRESS_BOOK WHERE SID=?';
    db.queryAsync(sql, [req.params.sid])
        .then(results => {
            if (results.length) {
                results[0].birthday = moment(results[0].birthday).format('YYYY-MM-DD');
                res.render('addr_book/edit', results[0]);
            } else {
                res.redirect('/addr_book');
            }
        }).catch(ex => {
            console.log('ex', ex);
        });
})

router.post('/edit', upload.none(), (req, res) => {
    const output = {
        success: false,
        error: '',
    };

    if (req.body.name.length < 2) {
        output.error = '姓名字元長度太短';
        return res.json(output);
    }

    const email_pattern = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    if (!email_pattern.test(req.body.email)) {
        output.error = 'Email 格式錯誤';
        return res.json(output);
    }

    const data = { ...req.body };
    res.json(data);

    return;
});

module.exports = router;