'use strict';

require('dotenv').config();
require('./strategies/login.passport.strategy');

const express = require('express');
const port = process.env.PORT || 3000;
const app = express();
const passport = require('passport');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// routes
const users = require('./routes/users');
const schedules = require('./routes/schedules');
const initialize = require('./routes/initialize');
const auth = require('./routes/auth');

// middle ware
app.use(helmet());
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(morgan('dev'));
app.use(passport.initialize());
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use('/auth', auth);

app.use('/api', initialize);
app.use('/api', users);
app.use('/api/protected', schedules);

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
