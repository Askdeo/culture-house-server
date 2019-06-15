const path = require('path');

const expres = require('express');


const app = expres();

app.use('/docs', expres.static(path.join(__dirname, 'docs')));
app.use('/images', expres.static(path.join(__dirname, 'images')));


const port = 5000;

app.listen(port);