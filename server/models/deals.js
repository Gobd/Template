var mongoose = require('mongoose'),
    Bus = require('./bus.js');

//coords must be in long, lat order, this is the opposite of what the google maps api requires

var dealsSchema = new mongoose.Schema({
    dealsName: {type: String, required: true},
    day: [{type: Number, min: 0, max: 6, required: true}],
    dealHours: {type: Number},
    description: String,
    source: String,
    pending: {type: Boolean, default: true},
    expired: {type: Boolean, default: false},
    exceptions: String,
    bus: {type: mongoose.Schema.Types.ObjectId, ref: Bus},
    address: [{type: String, unique: true, required: true}],
    loc: {
        type: {type: String, default: "Point"},
        coordinates: [{type: Number, required: true, unique: true}]
    }
});

//todo, pre-save we want to find the business and copy the address and location to the deal, use some sort of lodash, maybe assign
//if we do this it would have to be a parallel middleware it looks like

dealsSchema.index({loc: '2dsphere'});

module.exports = mongoose.model('Deals', dealsSchema);
