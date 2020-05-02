'use strict'

class LowerCase {
    forSignUp(req, res, next) {
        const { body } = req;
        const { firstName, surname, email } = body;

        body.firstName = firstName.toLowerCase();
        body.surname = surname.toLowerCase();
        body.email = email.toLowerCase();

        next();
    }

    forLogin(req, res, next) {
        const { body } = req;
        const { email } = body;

        body.email = email.toLowerCase();

        next();
    }

    forResendCode(req, res, next) {
        const { body } = req;
        const { email } = body;

        if (email) {
            body.email = email.toLowerCase();
        }

        next();
    }
}

module.exports = new LowerCase();