var express = require('express'),
  bodyParser = require('body-parser'),
  cors = require('cors'),
  port = 3001,
  compression = require('compression'),
  mongoose = require('mongoose'),
  config = require('./config'),
  jwt = require('jwt-simple'),
  request = require('request'),
  moment = require('moment'),
  qs = require('querystring'),
  User = require('./models/user.js'),
  accounts = require('./endpoints/accounts.js'),
  app = express();

mongoose.connect('mongodb://localhost/personal');
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', function() {
  console.log('Connected to MongoDB!');
});

app.use(compression());
app.use(express.static('../dist'));
app.use(cors());
app.options('*', cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/api/me', ensureAuthenticated, accounts.getApiMe);
app.put('/api/me', ensureAuthenticated, accounts.putApiMe);
app.post('/auth/login', accounts.postAuthLogin);
app.post('/auth/signup', accounts.postAuthSignup);
app.post('/auth/google', accounts.postAuthGoogle);
app.post('/auth/facebook', accounts.postAuthFacebook);
app.post('/auth/unlink', ensureAuthenticated, accounts.postAuthUnlink);

function ensureAuthenticated(req, res, next) {
  if (!req.header('Authorization')) {
    return res.status(401).send({
      message: 'Please make sure your request has an Authorization header'
    });
  }
  var token = req.header('Authorization').split(' ')[1];
  var payload = null;
  try {
    payload = jwt.decode(token, config.TOKEN_SECRET);
  } catch (err) {
    return res.status(401).send({
      message: err.message
    });
  }

  if (payload.exp <= moment().unix()) {
    return res.status(401).send({
      message: 'Token has expired'
    });
  }
  req.user = payload.sub;
  next();
}

app.listen(port, function() {
  console.log('Listening on port ' + port);
});

module.exports = app;
