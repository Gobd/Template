const express = require('express'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    port = 3001,
    compression = require('compression'),
    mongoose = require('mongoose'),
    helmet = require('helmet'),
    app = express(),
    Promise = require('bluebird'),
    config = require('./config.js'),
    accounts = require('./endpoints/accounts.js'),
    checkRole = require('./checkRole.js'),
    data = require('./endpoints/data.js'),
    protectJSON = require('./protectJSON.js');

mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost/weekly');
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', function () {
    console.log('Connected to MongoDB!');
});

app.use(helmet());
app.use(protectJSON);
app.use(compression());
app.use(express.static(__dirname + '/../dist'));
app.use(cors());
app.options('*', cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/api/me', checkRole('user'), accounts.getApiMe);
app.put('/api/me', checkRole('user'), accounts.putApiMe);
app.post('/auth/login', accounts.postAuthLogin);
app.post('/auth/signup', accounts.postAuthSignup);
app.post('/auth/google', accounts.postAuthGoogle);
app.post('/auth/facebook', accounts.postAuthFacebook);
app.post('/auth/twitter', accounts.postAuthTwitter);
app.post('/auth/unlink', checkRole('user'), accounts.postAuthUnlink);

app.post('/api/bus', checkRole('user'), data.addBus);
app.put('/api/bus/:id', checkRole('user'), data.editBus);
app.delete('/api/bus/:id', checkRole('user'), data.deleteBus);

app.post('/api/deal', checkRole('user'), data.addDeal);
app.put('/api/deal/:id', checkRole('user'), data.editDeal);
app.delete('/api/deal/:id', checkRole('user'), data.deleteDeal);

app.listen(port, function () {
    console.log('Listening on port ' + port);
});

module.exports = app;
