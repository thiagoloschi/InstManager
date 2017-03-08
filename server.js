//'use strict';
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var ig = require('instagram-node').instagram();
var user;

app.use(express.static(__dirname+'/public'));
app.use(bodyParser.json());

api = require('./models/api.js');

exports.authorize_user = function(req, res){
	console.log('/login');
	ig.use({
		client_id: api.client_id,
		client_secret: api.client_secret
	});
	console.log('/login');
	res.redirect(ig.get_authorization_url(api.redirect_uri, { scope: ['basic follower_list relationships']}));
};

exports.handleauth = function(req, res) {
	console.log('/call');
	ig.authorize_user(req.query.code, api.redirect_uri, function(err, result) {
		if (err) {
		  console.log(err.body);
		  res.send("An error occurred when trying to authorize user.");
		} else {
		  console.log('Access token is ' + result.access_token);
		  user = result.user;
		  res.redirect('http://localhost:5000/#!/main');
		}
	});
};

//------------------------ ROUTES --------------------------
app.get('/', function(req, res) {
	res.send('Go to /login');
});
app.get('/login', exports.authorize_user);
app.get('/callback/', exports.handleauth);
app.get('/data/user', function(req, res) {
		res.send(user);
});

app.listen(5000);
console.log('InstManager is now running...');
