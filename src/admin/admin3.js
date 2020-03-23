const express = require('express');

const router = express.Router();

//Self-defined middleware:
router.use((req, res, next) => {
    res.locals.memberData = {
        name: "Dick",
        age: "87",
    };
    next();
});

router.get('/:action?/:id?', (req, res) => {
    res.json({
        params: req.params,
        url: req.url,
        baseUrl: req.baseUrl,
        locals: res.locals
    });
});

module.exports = router;