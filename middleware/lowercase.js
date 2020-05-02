'use strict'

class LowerCase {
    forSearch(req, res, next) {
        const { query } = req;
        const { q } = query;

        if (q) {
            query.q = q.toLowerCase();
        }
        
        next();
    }

    forSignUp(req, res, next) {
        const { body } = req;
        const { firstName, surname, email, tags } = body;

        body.firstName = firstName.toLowerCase();
        body.surname = surname.toLowerCase();
        body.email = email.toLowerCase();

        if (tags) {
            body.tags = body.tags.map(tag => tag.toLowerCase());
        }

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