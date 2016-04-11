const mongoose = require('mongoose'),
    Promise = require('bluebird'),
    _ = require('lodash'),
    Bus = require('../models/bus.js'),
    Deal = require('../models/deals.js');

mongoose.Promise = require('bluebird');

module.exports = {

    addBus: function (req, res) {
        var deal = new Deal(req.body.deal);
        var bus = new Bus(req.body.bus);
        bus.deals = [deal._id];
        deal.bus = [bus._id];
        Promise.join(deal.save(), bus.save(), function (dealResp, busResp) {
            return [dealResp, busResp]
        }).then(function (resp) {
            return res.status(200).json(resp);
        }).catch(function (err) {
            return res.status(500).json(err);
        })
    },
    //this one below doesn't actually work, but it will look something like this
    //the user will probably have the geokeys and address we need and can add them so the deal actually will save
    //we could also use a parallel middleware to retrieve them if not
    addDeal: function (req, res) {
        var deal = new Deal(req.body);
        var bus = Bus.findByIdAndUpdate(req.body.bus, {$push: {deals: deal._id}});
        Promise.join(deal.save(), bus.exec(), function (dealResp, busResp) {
            return [dealResp, busResp]
        }).then(function (resp) {
            return res.status(200).json(resp);
        }).catch(function (err) {
            return res.status(500).json(err);
        })
    },
    //to edit a business will probably need to deal with special circumstances so we can push data into the arrays (address, loc, deals, contacts, maybe even pictures)
    //unless that just magically happens with this method which wouldn't be surprising
    editBus: function (req, res) {
        Bus.findByIdAndUpdate(req.params.id, req.body, function(err, resp){
            return err ? res.status(500).json(err) : res.status(200).json(resp);
        });
    },

    editDeal: function (req, res) {
        Deal.findByIdAndUpdate(req.params.id, req.body, function(err, resp){
            return err ? res.status(500).json(err) : res.status(200).json(resp);
        });
    },

    deleteBus: function (req, res) {
        Bus.findByIdAndRemove(req.params.id, function(err, resp){
            return err ? res.status(500).json(err) : res.status(200).json(resp);
        });
    },

    deleteDeal: function (req, res) {
        Deal.findByIdAndRemove(req.params.id, function(err, resp){
            return err ? res.status(500).json(err) : res.status(200).json(resp);
        });
    }
};