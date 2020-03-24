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
const router = express.Router();

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
        .then(results=>{
            output.totalRows = results[0].num;
            output.totalPages = Math.ceil(output.totalRows/perPage);
            if(output.page < 1) output.page=1;
            if(output.page > output.totalPages) output.page=output.totalPages;
            const sql = `SELECT * FROM address_book LIMIT ${(output.page-1)*output.perPage}, ${output.perPage}`;
            return db.queryAsync(sql);
        })
        .then(results=>{
            output.rows = results;
            res.json(output);
        })
        .catch(ex=>{

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

module.exports = router;