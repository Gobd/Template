var mongoose = require('mongoose'),
    Deals = require('./deals.js');

//coords must be in long, lat order, this is the opposite of what the google maps api requires

var busSchema = new mongoose.Schema({
    busName: {type: String, required: true},
    deals: [{type: mongoose.Schema.Types.ObjectId, ref: Deals}],
    address: [{type: String, unique: true, required: true}],
    loc: {
        type: {type: String, default: "Point"},
        coordinates: [{type: Number, required: true, unique: true}]
    },
    busHours: {type: Number},
    picture: String,
    contacts: [{
        email: {type: String, default: ''},
        phone: {type: String, default: ''},
        website: {type: String, default: ''}
    }]
});

busSchema.index({loc: '2dsphere'});

module.exports = mongoose.model('Bus', busSchema);
