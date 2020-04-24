'use strict';

const nodemailer = require('nodemailer');
const mailgunTransport = require('nodemailer-mailgun-transport');
const emailTemplate = require('../shared/email-template');

// const auth = {
//   auth: {
//     api_key: process.env.MAILGUN_API_KEY,
//     domain: process.env.MAILGUN_DOMAIN,
//   },
// };

// const emailClient = nodemailer.createTransport(mailgunTransport(auth));

const mailTrap = {
  host: 'smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: '8496df82ba0789',
    pass: 'af60ea0a91905e',
  },
};

const emailClient = nodemailer.createTransport(mailTrap);

function sendEmail(userId, email, firstName, secretToken) {
  'use strict';

  const emailOptions = {
    from: '<donotreply@anecdote.com.au>',
    to: email,
    subject: 'Sign Up',
    text: 'Thank you for signing up to Anecdote', // TODO
    html: emailTemplate.generate(userId, firstName, secretToken),
  };

  return new Promise((resolve, reject) => {
    emailClient.sendMail(emailOptions, (err, info) => {
      if (err) {
        reject(err);
      } else {
        resolve(info);
      }
    });
  });
}

module.exports = {
  sendEmail,
};
