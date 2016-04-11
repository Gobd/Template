var mongoose = require('mongoose')
  , _ = require('lodash')
  , config = require('../config')
  , jwt = require('jwt-simple')
  , request = require('request')
  , moment = require('moment')
  , qs = require('querystring')
  , User = require('../models/user.js');

mongoose.Promise = require('bluebird');

function createJWT(user) {
  var payload = {
    sub: user._id,
    iat: moment().unix(),
    exp: moment().add(14, 'days').unix(),
    role: user.role
  };
  return jwt.encode(payload, config.TOKEN_SECRET, 'HS256');
}

module.exports = {

  getApiMe : function(req, res) {
    User.findById(req.user, function(err, user) {
      res.json(user);
    });
  },

  putApiMe : function(req, res) {
    User.findById(req.user, function(err, user) {
      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }
      user.displayName = req.body.displayName || user.displayName;
      user.email = req.body.email || user.email;
      user.save(function(err) {
        res.status(200).end();
      });
    });
  },

  postAuthLogin : function(req, res) {
    User.findOne({ email: req.body.email }, '+password', function(err, user) {
      if (!user) {
        return res.status(401).json({ message: 'Invalid email and/or password' });
      }
      user.comparePassword(req.body.password, function(err, isMatch) {
        if (!isMatch) {
          return res.status(401).json({ message: 'Invalid email and/or password' });
        }
        res.json({ token: createJWT(user) });
      });
    });
  },

    postAuthSignup : function(req, res) {
    User.findOne({ email: req.body.email }, function(err, existingUser) {
      if (existingUser) {
        return res.status(409).json({ message: 'Email is already taken' });
      }
      var user = new User({
        provider: 'Username & Password',
        displayName: req.body.displayName,
        email: req.body.email,
        password: req.body.password
      });
      user.save(function(err, result) {
        if (err) {
          res.status(500).json({ message: err.message });
        }
        res.json({ token: createJWT(result) });
      });
    });
  },

  postAuthGoogle: function(req, res) {
     var accessTokenUrl = 'https://accounts.google.com/o/oauth2/token';
     var peopleApiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';
     var params = {
       code: req.body.code,
       client_id: req.body.clientId,
       client_secret: config.googleAuth.clientSecret,
       redirect_uri: req.body.redirectUri,
       grant_type: 'authorization_code'
     };

     // Step 1. Exchange authorization code for access token.
     request.post(accessTokenUrl, {
       json: true,
       form: params
     }, function(err, response, token) {
       var accessToken = token.access_token;
       var headers = {
         Authorization: 'Bearer ' + accessToken
       };

       // Step 2. Retrieve profile information about the current user.
       request.get({
         url: peopleApiUrl,
         headers: headers,
         json: true
       }, function(err, response, profile) {
         if (profile.error) {
           return res.status(500).json({
             message: profile.error.message
           });
         }
         // Step 3a. Link user accounts.
         if (req.header('Authorization')) {
           User.findOne({ google: profile.sub }, function(err, existingUser) {
             if (existingUser) {
               return res.status(409).json({
                 message: 'There is already a Google account that belongs to you'
               });
             }
             var token = req.header('Authorization').split(' ')[1];
             var payload = jwt.decode(token, config.TOKEN_SECRET, false, 'HS256' );
             User.findById(payload.sub, function(err, user) {
               if (!user) {
                 return res.status(400).json({
                   message: 'User not found'
                 });
               }
               user.provider = 'Google';
               user.google = profile.sub;
               user.email = profile.email;
               user.picture = user.picture || profile.picture.replace('sz=50', 'sz=200');
               user.displayName = user.displayName || profile.name;
               user.save(function() {
                 var token = createJWT(user);
                 res.json({
                   token: token
                 });
               });
             });
           });
         } else {
           // Step 3b. Create a new user account or return an existing one.
           User.findOne({email: profile.email}, function(err, existingUser) {
             if (existingUser) {
                 if (existingUser.provider === 'Google') {
                   return res.json({
                     token: createJWT(existingUser)
                   });
                 } else if (existingUser.provider === 'Facebook' || existingUser.provider === 'Username & Password' || existingUser.provider === 'Twitter') {
                   return res.status(400).json({message: 'You already have a ' + existingUser.provider + ' Account'});
                 }
             } else {
               var user = new User();
               user.provider = 'Google';
               user.google = profile.sub;
               user.email = profile.email;
               user.picture = profile.picture.replace('sz=50', 'sz=200');
               user.displayName = profile.name;
               user.save(function(err) {
                 var token = createJWT(user);
                 res.json({
                   token: token
                 });
               });
             }
           });
         }
       });
     });
   },

   postAuthFacebook: function(req, res) {
     var fields = ['id', 'email', 'first_name', 'last_name', 'link', 'name'];
     var accessTokenUrl = 'https://graph.facebook.com/v2.5/oauth/access_token';
     var graphApiUrl = 'https://graph.facebook.com/v2.5/me?fields=' + fields.join(',');
     var params = {
       code: req.body.code,
       client_id: req.body.clientId,
       client_secret: config.facebookAuth.clientSecret,
       redirect_uri: req.body.redirectUri
     };

     // Step 1. Exchange authorization code for access token.
     request.get({
       url: accessTokenUrl,
       qs: params,
       json: true
     }, function(err, response, accessToken) {
       if (response.statusCode !== 200) {
         return res.status(500).json({
           message: accessToken.error.message
         });
       }

       // Step 2. Retrieve profile information about the current user.
       request.get({
         url: graphApiUrl,
         qs: accessToken,
         json: true
       }, function(err, response, profile) {
         if (response.statusCode !== 200) {
           return res.status(500).json({
             message: profile.error.message
           });
         }
         if (req.header('Authorization')) {
           User.findOne({ facebook: profile.id }, function(err, existingUser) {
             if (existingUser) {
               return res.status(409).json({
                 message: 'There is already a Facebook account that belongs to you'
               });
             }
             var token = req.header('Authorization').split(' ')[1];
             var payload = jwt.decode(token, config.TOKEN_SECRET, false, 'HS256');
             User.findById(payload.sub, function(err, user) {
               if (!user) {
                 return res.status(400).json({
                   message: 'User not found'
                 });
               }
               user.provider = 'Facebook';
               user.facebook = profile.id;
               user.email = profile.email;
               user.picture = user.picture || 'https://graph.facebook.com/v2.3/' + profile.id + '/picture?type=large';
               user.displayName = user.displayName || profile.name;
               user.save(function() {
                 var token = createJWT(user);
                 res.json({
                   token: token
                 });
               });
             });
           });
         } else {
           // Step 3. Create a new user account or return an existing one.
           User.findOne({email: profile.email}, function(err, existingUser) {
             if (existingUser) {
                 if (existingUser.provider === 'Facebook') {
                   return res.json({
                     token: createJWT(existingUser)
                   });
                 } else if  (existingUser.provider === 'Google' || existingUser.provider === 'Username & Password' || existingUser.provider === 'Twitter') {
                   return res.status(400).json({message: 'You already have a ' + existingUser.provider + ' Account'});
                 }
             } else {
             var user = new User();
             user.provider = 'Facebook';
             user.facebook = profile.id;
             user.email = profile.email;
             user.picture = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
             user.displayName = profile.name;
             user.save(function() {
               var token = createJWT(user);
               res.json({
                 token: token
               });
             });
           }
           });
         }
       });
     });
   },

   postAuthTwitter: function(req, res) {
  var requestTokenUrl = 'https://api.twitter.com/oauth/request_token';
  var accessTokenUrl = 'https://api.twitter.com/oauth/access_token';
  var profileUrl = 'https://api.twitter.com/1.1/users/show.json?screen_name=';

  // Part 1 of 2: Initial request from Satellizer.
  if (!req.body.oauth_token || !req.body.oauth_verifier) {
    var requestTokenOauth = {
      consumer_key: config.TWITTER_KEY,
      consumer_secret: config.TWITTER_SECRET,
      callback: req.body.redirectUri
    };

    // Step 1. Obtain request token for the authorization popup.
    request.post({ url: requestTokenUrl, oauth: requestTokenOauth }, function(err, response, body) {
      var oauthToken = qs.parse(body);

      // Step 2. Send OAuth token back to open the authorization screen.
      res.json(oauthToken);
    });
  } else {
    // Part 2 of 2: Second request after Authorize app is clicked.
    var accessTokenOauth = {
      consumer_key: config.TWITTER_KEY,
      consumer_secret: config.TWITTER_SECRET,
      token: req.body.oauth_token,
      verifier: req.body.oauth_verifier
    };

    // Step 3. Exchange oauth token and oauth verifier for access token.
    request.post({ url: accessTokenUrl, oauth: accessTokenOauth }, function(err, response, accessToken) {

      accessToken = qs.parse(accessToken);

      var profileOauth = {
        consumer_key: config.TWITTER_KEY,
        consumer_secret: config.TWITTER_SECRET,
        oauth_token: accessToken.oauth_token
      };

      // Step 4. Retrieve profile information about the current user.
      request.get({
        url: profileUrl + accessToken.screen_name,
        oauth: profileOauth,
        json: true
      }, function(err, response, profile) {

        // Step 5a. Link user accounts.
        if (req.header('Authorization')) {
          User.findOne({ twitter: profile.id }, function(err, existingUser) {
            if (existingUser) {
              return res.status(409).json({ message: 'There is already a Twitter account that belongs to you' });
            }

            var token = req.header('Authorization').split(' ')[1];
            var payload = jwt.decode(token, config.TOKEN_SECRET);

            User.findById(payload.sub, function(err, user) {
              if (!user) {
                return res.status(400).json({ message: 'User not found' });
              }
              user.provider = 'Twitter';
              user.twitter = profile.id;
              user.displayName = user.displayName || profile.name;
              user.picture = user.picture || profile.profile_image_url.replace('_normal', '');
              user.save(function(err) {
                res.json({ token: createJWT(user) });
              });
            });
          });
        } else {
          // Step 5b. Create a new user account or return an existing one.
          User.findOne({email: profile.email}, function(err, existingUser) {
            if (existingUser) {
                if (existingUser.provider === 'Twitter') {
                  return res.json({
                    token: createJWT(existingUser)
                  });
                } else if  (existingUser.provider === 'Google' || existingUser.provider === 'Username & Password' || existingUser.provider === 'Facebook') {
                  return res.status(400).json({message: 'You already have a ' + existingUser.provider + ' Account'});
                }

            var user = new User();
            user.provider = 'Twitter';
            user.twitter = profile.id;
            user.displayName = profile.name;
            user.picture = profile.profile_image_url.replace('_normal', '');
            user.save(function() {
              res.json({ token: createJWT(user) });
            });
          }});
        }
      });
    });
  }
},

  postAuthUnlink : function(req, res) {
    var provider = req.body.provider;
    var providers = ['facebook', 'google', 'twitter'];

    if (providers.indexOf(provider) === -1) {
      return res.status(400).json({ message: 'Unknown OAuth Provider' });
    }

    User.findById(req.user, function(err, user) {
      if (!user) {
        return res.status(400).json({ message: 'User Not Found' });
      }
      user[provider] = undefined;
      user.save(function() {
        res.status(200).end();
      });
    });
  }

};
