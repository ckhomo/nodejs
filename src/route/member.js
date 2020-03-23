const express = require('express');
const router = express.Router();

router.get('/login', (req, res) => {

    res.render('member/login');
});
router.post('/login', (req, res) => {
    //Dummy user datas:
    const users = {
        'user_A': {
            nickname: 'FarreSirro',
            pw: '123456'
        },
        'user_B': {
            nickname: 'girl17lion27',
            pw: '777777'
        },
    };

    const output = {
        //Success or not:
        success: false,
        error: 'Invalid account or password!',
        body: req.body
    };

    // Account verification:
    if (req.body.account && users[req.body.account]) {//ACC
        if (req.body.password === users[req.body.account].pw) {//PWD
            req.session.LoginUser = {
                account: req.body.account,
                nickname: users[req.body.account].nickname
            };
            output.success = true;
            delete output.error;
        }
    }
    // res.json({
    //     body: req.body
    // });
    res.json(output);
    // res.json(req.session);
});

router.get('/logout',(req,res)=>{
    delete req.session.LoginUser;
    res.redirect('/');
})
module.exports = router;