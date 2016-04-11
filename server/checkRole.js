var jwt = require('jwt-simple'),
    moment = require('moment'),
    _ = require('lodash'),
    config = require('./config');

var checkRole = function (role) {
    return function (req, res, next) {
        if (!req.header('Authorization')) {
            return res.status(401).send({
                message: 'Please make sure your request has an Authorization header'
            });
        }
        var token = req.header('Authorization').split(' ')[1];
        var payload = null;
        try {
            payload = jwt.decode(token, config.TOKEN_SECRET, false, 'HS256');
        } catch (err) {
            return res.status(401).send({
                message: err.message
            });
        }
        if (payload.exp <= moment().unix()) {
            return res.status(401).send({
                message: 'Token has expired'
            });
        } else if (_.indexOf(userRoles, payload.role) >= _.indexOf(userRoles, role)) {
            req.user = payload.sub;
            next();
        } else {
            return res.status(401).send({
                message: 'Incorrect role'
            });
        }
    };
};

module.exports = checkRole;