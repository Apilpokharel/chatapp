
'use strict';

const express = require('express');
const app  = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const cors = require('cors');
const routes = require('./routes/RoutesModel');


app.use(morgan('dev'));
app.use(helmet());
app.set('view engine', 'ejs');
app.use('/', express.static(__dirname+'/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressValidator());
app.use(cookieParser());
const corsOption = {
    method: ['POST', 'GET', 'DELET', 'PATCH'],
    origin: '*',
    optionsSuccessStatus: 204
};

app.use(flash());
app.use(cors(corsOption));
app.use('/', routes);


module.exports = app;