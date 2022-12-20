const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const app = express();
const port = process.env.port;
const path = require('path');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const Keygrip = require('keygrip');
const flash = require('connect-flash');
const mysql = require('./component/_core/database/mysql');
const bodyParser = require('body-parser');
const config = JSON.parse(process.env.config);
const userRoute = require('./component/user/route');
const dashboardRoute = require('./component/dashboard/route')
const contactRoute = require('./component/contact/route');
//Company Vi
const companyRoute = require('./component/company/route');
const usermanual = require('./component/usermanual/route');
//Bình
const jobRoute = require('./component/job/route');
const listRoute = require('./component/list/route');


//format ngay gio viet nam
const moment = require('moment'); // require
moment.locale('Vi');
app.locals.moment = moment;

const dataHandle = require('./component/_helper/dataHandle');
const connection = mysql.connectDb(config.mysql.database);
connection.then(success => {
    console.log("database connection successfull");
    global.dbconnect = success;
}).catch(err => {
    console.log("database connection false", err);
});

//// redis
const redis = require('redis');
const client = redis.createClient();
client.on('connect', function() {
    console.log('Redis connected');
});
global.redisClient = client;
//// end redis

// cookie
app.use(cookieSession({
    name: 'session',
    keys: new Keygrip(['key1', 'key2'], 'SHA384', 'base64'),

    // Cookie Options
    maxAge: 96 * 60 * 60 * 1000 //  96 hours
}));
// end cookie

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.set('layout', 'partials/layout');
app.use(expressLayouts);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(flash());

app.use(function(req, res, next) {
    res.locals.success_messages = req.flash('success_messages');
    res.locals.error_messages = req.flash('error_messages');
    next();
});




// app.use('/v1/organization', [auth], orgRoute);
app.get('/', (req, res, next) => {
    res.redirect('/dashboard');
});
// route
app.use('/dashboard', dashboardRoute);
app.use('/auth', userRoute);
app.use('/contact', contactRoute);
app.use('/company', companyRoute);
app.use('/list', listRoute);
app.use('/job', jobRoute);
app.use('/usermanual',usermanual);



// catch 404 and forward to error handler
app.use((req, res, next) => {
    dataHandle.HandleError(res, 404, 'NOT FOUND');
});

// error handler
app.use((err, req, res, next) => {
    dataHandle.HandleError(res, err.status || 500, err.message);
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
});