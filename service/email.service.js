'use strict';

const nodemailer = require('nodemailer');
const mailgunTransport = require('nodemailer-mailgun-transport');
const emailTemplate = require('../shared/email-template');

class EmailService {
  constructor() {
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
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASSWORD,
      },
    };

    this.emailClient = nodemailer.createTransport(mailTrap);
  }

  sendEmail(userId, email, firstName, secretCode) {
    const emailOptions = {
      from: '<donotreply@anecdote.com.au>',
      to: email,
      subject: 'Sign Up',
      text: emailTemplate.generateText(userId, firstName, secretCode),
      html: emailTemplate.generateHTML(userId, firstName, secretCode),
    };

    return new Promise((resolve, reject) => {
      this.emailClient.sendMail(emailOptions, (err, info) => {
        if (err) {
          reject(err);
        } else {
          resolve(info);
        }
      });
    });
  }
}

module.exports = new EmailService();
