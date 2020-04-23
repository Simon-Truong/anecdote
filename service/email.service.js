const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport( {
    service:  'Mailgun',
    auth: {
     domain: `${process.env.MAIL_GUN_DOMAIN}`,
     api_key: `${process.env.MAIL_GUN_API_KEY}`   
    }
});

function sendEmail(email, secretToken) {
    const mailOpts = {
        from: 'donotreply@anecdote.com.au',
        to: email,
        subject: 'Anecdote Sign Up',
        text : 'Thank you for signing up to Anecdote',
        html : '<b>Testing</b>'
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOpts, (error, response) => {
            if (error) {
                console.log({error});
                reject(error);
            }

            resolve(response);
        });
    })
}

module.exports = {
    sendEmail
}