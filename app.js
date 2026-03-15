const express = require('express');
const app = express();
const path = require('path');
const session = require("express-session");
const router = require('./routes/myrouter');
const bcrypt = require('bcrypt');

require("./config/db");
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({extended:false}));

// ⭐ ต้องอยู่ก่อน router
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: "mysecretKey",
    resave: false,
    saveUninitialized: true
}));

app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    res.locals.login = req.session.user ? true : false;
    next();
});

app.use(router);
app.use(express.urlencoded({extended:false}));

app.listen(8080, ()=>{
    console.log("Starting server at port: 8080");
});