var express = require('express')
  , bodyParser = require('body-parser')
  , cors = require('cors')
  , port = 8080
  , localStrat =require('passport-local')
  , passport = require('passport')
  , facebookStrat = require('passport-facebook')
  , googleStrat = require ('passport-google-oauth')
  , mongoose = require('mongoose')
  , session = require('express-session')
  , config = require('./.config')
  , MongoStore = require('connect-mongo')(session)
  , app = express();

mongoose.connect('mongodb://localhost/personal');
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', function() {
    console.log('Connected to MongoDB!');
});

app.use(session(
  {
    secret: config.secret,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(__dirname + '../dist'));
app.use(cors());
app.options('*', cors());
app.use(bodyParser.json());

app.listen(port, function() {
    console.log('Listening on port ' + port);
});

module.exports = app;
