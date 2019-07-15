const path = require('path');

const expres = require('express');

const bodyParser = require('body-parser');
const passport = require('passport');

const usersRoutes = require('./routes/users');

const app = expres();

app.use(bodyParser.json());
app.use('/docs', expres.static(path.join(__dirname, 'docs')));
app.use('/images', expres.static(path.join(__dirname, 'images')));
app.use('/videos', expres.static(path.join(__dirname, 'videos')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// Passport middleware
app.use(passport.initialize());

// Passport Config
require('./util/passport')(passport);

// Use Routes
app.use('/', usersRoutes);

const port = 5000;

app.listen(port);