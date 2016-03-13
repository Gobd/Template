var express = require('express')
  , bodyParser = require('body-parser')
  , cors = require('cors')
  , port = 8080
  , app = express()
  , mongoose = require('mongoose')
  , session = require('express-session')
  , config = require('./.config')
  , db = mongoose.connection;


mongoose.connect('mongodb://localhost/ecommerce');
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Connected to MongoDB!');
});

app.use(session({secret: config.secret}));

app.use(express.static(__dirname + '../dist'));
app.use(cors());
app.options('*', cors());
app.use(bodyParser.json());

app.listen(port, function() {
    console.log('Listening on port ' + port);
});

module.exports = app;
