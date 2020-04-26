'use strict';

require('dotenv').config();
require('./authentication/passport-strategy');

const express = require('express');
const port = process.env.PORT || 3000;
const app = express();
const passport = require('passport');
const morgan = require('morgan');
const helmet = require('helmet');

const cors = require('cors');

// routes
const users = require('./routes/users');

// middle ware
app.use(helmet());
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(passport.initialize());

app.use('/api', users);

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
