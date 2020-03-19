const express = require('express');

var app = express();

//順序:由上而下。
//若有路徑衝突，會優先send上層之連結。

// Link to designated pages.
app.get('/',(req, res)=>{
    res.send(`<h2>Hello Mr.Lee!</h2>`);
});

app.get('/try',(req,res)=>{
    res.send(`<h2>TRY THIS ROUTER.</h2>`);
});

// Static folder:
app.use(express.static("public"));

// Post error message.
app.use((req,res)=>{
    res.type('text/html');
    res.status = 404;
    res.send(`
    path:${req.url}<br>
    <h2>404 - Data not found.</h2>
    `);
});

app.listen(5487, function(){
    console.log("Listening on port:5487.");  
});