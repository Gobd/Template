module.exports = function(req, res, next) {
    var _json = res.json;
    res.json = function(body) {
        var contentType = res.getHeader('Content-Type');
        if ( contentType && contentType.indexOf('application/json') !== -1 ) {
            if (2 === arguments.length) {
                // res.send(body, status) backwards compat
                if ('number' !== typeof body && 'number' === typeof arguments[1]) {
                    this.statusCode = arguments[1];
                } else {
                    this.statusCode = body;
                    body = arguments[1];
                }
            }
            body = ")]}',\n" + body;
            return _json.call(res, body);
        }
        _json.apply(res, arguments);
    };
    next();
};