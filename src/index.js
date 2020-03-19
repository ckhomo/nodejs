const express = require('express');

const app = express();

app.get('/',(req, res)=>{
    res.send("Hello world!");
});

app.listen(6666, function(){
    console.log("Listening on port:6666.");
})