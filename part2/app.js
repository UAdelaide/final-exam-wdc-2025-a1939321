const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
var mysql = require('mysql');

const app = express();


});
// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret: 'b706835de79a2b4e80506f582af3676ac8361638',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(express.static(path.join(__dirname, '/public')));

// Routes
const walkRoutes = require('./routes/walkRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/walks', walkRoutes);
app.use('/api/users', userRoutes);

// Export the app instead of listening here
module.exports = app;