
import { config } from 'dotenv';
import path from 'path';
config({path: './config/config.env'});
import express from 'express';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import router from './routes/index.js';
import passport from 'passport';
import morgan from 'morgan';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import methodOverride from 'method-override';


import { engine as exphbs } from 'express-handlebars';

//passport config
import passportConfig from './config/passport.js';
passportConfig(passport);

//Connect to database
connectDB();
const app = express();

//Body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Method override
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        let method = req.body._method;
        delete req.body._method;
        return method;
    } 
}));

//Logging
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
//Handlebars helpers
import hbsHelpers from './helpers/hbs.js';

//Handlebars
app.engine('.hbs', exphbs({helpers:{...hbsHelpers}, defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', '.hbs');

//session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI || mongoose.connection._connectionString }),
}));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//set global var
app.use(function(req, res, next) {
    res.locals.user = req.user || null;
    next();
});

//Static folder
app.use(express.static(path.join(path.resolve(), 'public')));

//routes
app.use('/', router);
app.use('/auth', (await import('./routes/auth.js')).default);
app.use('/gossips', (await import('./routes/gossips.js')).default);

const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Server running on ${process.env.NODE_ENV} mode on port ${PORT}`));

