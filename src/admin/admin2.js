const express = require('express');
const router = express.Router();
// Link to designated pages.
router.get('/', (req, res) => {
    // res.send(`<h2>Hello Mr.Lee!</h2>`);
    res.render('home', { name: "ckhomo" });
});

router.get('/try', (req, res) => {
    res.send(`<h2>TRY THIS ROUTER.</h2>`);
});

module.exports = router;