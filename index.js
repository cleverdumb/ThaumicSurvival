const express = require('express');
const path = require('path');
const app = express();

const port = 6500;

app.use(express.static('static'));

app.get('/', (req,res)=> {
    res.sendFile(path.join(__dirname, '/index.html'));
    // res.send('Hello world')
})

app.listen(port);
console.log('listening at port 6500')