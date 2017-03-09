//'use strict';
var express = require('express');
var app = express();
var https = require('https');
var rqst = require('request-promise')
var bodyParser = require('body-parser');
var _ = require('lodash');
var ig = require('instagram-node').instagram();
var user;

app.use(express.static(__dirname+'/public'));
app.use(bodyParser.json());

//Creates the api object
api = require('./models/api.js');

//Creates the user object that will work as a sort of pagination to avoid unecessary requests to the server
User = require('./models/user.js');

//Starts user's autentication and creates a blank user object
exports.authorize_user = function(req, res){
	//Sets up the Instagram API
	ig.use({
		client_id: api.client_id,
		client_secret: api.client_secret,
	});
	user = new User(null, null, null, null, null, null, null);
	res.redirect(ig.get_authorization_url(api.redirect_uri, { scope: ['basic follower_list relationships']}));
};

//Starts user's authorization
exports.handleauth = function(req, res) {
	ig.authorize_user(req.query.code, api.redirect_uri, function(err, result) {
		if (err) {
		  console.log(err.body);
		  res.send("An error occurred when trying to authorize user.");
		} else {
		  console.log('Access token ' + result.access_token + ' successfuly authorized');
		  user.id = result.user.id;
		  api.access_token = result.access_token
		  ig.use({
			client_id: api.client_id,
			client_secret: api.client_secret,
			access_token: api.access_token
		  });
		  res.redirect('http://localhost:5000/#!/main');
		}
	});
};

//------------------ API METHODS ----------------------//

exports.getBasicInfo = function (req, res) {
	if (user.basicInfo == null){
		ig.user( user.id.toString(), function(err, result, remaining, limit) {
			if (err) {
			  console.log('An error occurred when trying to get the user basic info.\nCod: ' + err.code + '\nInstagram message: ' + err.error_message);
			} else {
			  console.log('User basic info was successfuly requested.');
			  user.basicInfo = result;
			  res.send(user.basicInfo);
			}
		});
	}else{
		res.send(user.basicInfo);
	}
};

exports.getFollowers = function (req, res) {
	if(user.followers == null){
		var options = {
    	uri: 'https://api.instagram.com/v1/users/self/followed-by',
    	qs: {
        	access_token: api.access_token
    	},
    	headers: {
        	'User-Agent': 'Request-Promise'
    	},
    	json: true
		};

	rqst(options)
	    .then(function (data) {
			user.followers = _.drop(data.data, 1);
			res.send(user.followers);
	    })
	    .catch(function (err) {
	        console.log('An error ocurred when requesting the followers');
	    });
	}else{
		res.send(user.followers);
	}
};

exports.getFollowings = function(req, res) {
	if(user.followings == null){
		var options = {
    	uri: 'https://api.instagram.com/v1/users/self/follows',
    	qs: {
        	access_token: api.access_token
    	},
    	headers: {
        	'User-Agent': 'Request-Promise'
    	},
    	json: true
		};

		rqst(options)
		    .then(function (data) {
				user.followings = data.data;
				res.send(user.followings);
		    })
		    .catch(function (err) {
		        console.log('An error ocurred when requesting the followings');
		    });

	}else{
		res.send(user.followings);
	}
};

exports.getNotFollowings = function(req, res) {
	user.notFollowings = _.differenceWith(user.followers, user.followings, _.isEqual);
	res.send(user.notFollowings);
};

exports.getNotFollowers = function(req, res) {
	user.notFollowers = _.differenceWith(user.followings, user.followers, _.isEqual);
	res.send(user.notFollowers);
};

exports.getMedias = function(req, res) {
	if (user.medias == null) {
		ig.user_media_recent(user.id.toString(), function(err, medias, pagination, remaining, limit) {
			if (err) {
			  console.log('An error occurred when trying to get the medias.\nCod: ' + err.code + '\nInstagram message: ' + err.error_message);
			} else {
			  console.log('Medias were successfuly requested.');
			  user.medias = medias;
			  res.send(medias);
			}
		});
	}else{

		res.send(user.medias);
	}
};

//------------------------ ROUTES --------------------------

app.get('/', function(req, res) {
	res.send('Go to /login');
});

// Authorization url
app.get('/login', exports.authorize_user);
// Redirect URI
app.get('/callback/', exports.handleauth);

// Api methods callings
app.get('/data/user', exports.getBasicInfo);
app.get('/data/followers', exports.getFollowers);
app.get('/data/followings', exports.getFollowings);
app.get('/data/notfollowings', exports.getNotFollowings);
app.get('/data/notfollowers', exports.getNotFollowers);
app.get('/data/medias', exports.getMedias);

app.listen(5000);
console.log('InstManager is now running...');
