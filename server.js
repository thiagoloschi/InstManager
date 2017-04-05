//'use strict';
var bodyParser = require('body-parser');
var express = require('express');
var mongoose = require('mongoose');
var https = require('https');
var session = require('client-sessions');
var rqst = require('request-promise')
var _ = require('lodash');

//Initiates the API for Instagram login handler
var ig = require('instagram-node').instagram();

var Schema = mongoose.Schema;

//Creates the api object
var api = {
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    redirect_uri: process.env.REDIRECT_URI
};

//Creates the user object that will work as a sort of pagination to avoid unecessary requests to the server
User = require('./models/user.js');

//Initiates the express application
var app = express();

app.set('port', (process.env.PORT || 5000));
app.set('views', __dirname + '/public/views');

//Connects to mongodb using Bluebird for promises
mongoose.Promise = require('bluebird');
mongoose.connect(process.env.DATABASE_URI);

//Middlewares
app.use(express.static(__dirname+'/public'));
app.use(bodyParser.json());

//Sets the client cookie and creates a session
app.use(session({
  cookieName: 'session',
  //this will become an environment variable with the proper secret
  secret: process.env.COOKIE_SECRET,
  duration: 30 * 60 * 1000,
  activeDuration: 30 * 60 * 1000,
  ephemeral: true
}));

//Starts user's autentication and creates a blank user object
exports.authorize_user = function(req, res){
	//Sets up the API keys
	ig.use({
		client_id: api.client_id,
		client_secret: api.client_secret,
	});

	res.redirect(ig.get_authorization_url(api.redirect_uri, { scope: ['basic follower_list relationships']}));
};

//Starts user's authorization
exports.handleauth = function(req, res) {
	ig.authorize_user(req.query.code, api.redirect_uri, function(err, result) {
		if (err) {
		  console.log(err.body);
		  res.send("An error occurred when trying to authorize user.");
		} else {
		  console.log('Access token successfully aquired');
		  req.session.cod = result.user.id;
		  req.session.name = result.user.username;
		  User.findOne({ cod: req.session.cod }, function(err, user) {
			  if (user) {
				  User.deleteOne({ cod: req.session.cod }, function (err) {
					  console.log('User ',req.session.name, ' was deleted before application started.');
				  });
			  }
			  var user = new User({
				cod: result.user.id,
				username: result.user.username,
				token: result.access_token,
				basicInfo: null,
				followers: null,
				followings: null,
				notRelated: null,
				medias: null
			  });
			  user.save(function(err){
				 if(err){
					 var err = 'An error occurred when trying to save user to DB';
					 console.log(err);
				 }else {
				   console.log('User ' + user.username + ' was successfully saved to DB.');
				 }

			 })
		  });

		  res.redirect('/#!/main');
		}
	});
};

//------------------ API METHODS ----------------------//

exports.getBasicInfo = function (req, res) {
    if(req.session.cod != undefined){
    	User.findOne({ cod: req.session.cod }, function(err, user) {
    		if (!user) {
                console.log('nao achou o codigo');
    			res.status(500).send('/end');
    		}else {
                res.locals.user = user;
                if (user.basicInfo == null){
                    var info;
        			var options = {
        		    	uri: 'https://api.instagram.com/v1/users/self/',
        		    	qs: {
        		        	access_token: user.token
        		    	},
        		    	headers: {
        		        	'User-Agent': 'Request-Promise'
        		    	},
        		    	json: true
        				};

        			rqst(options)
        			    .then(function (data) {
                            User.update({ cod: req.session.cod }, { basicInfo: data.data }, options, function(err){
                                if(err){
                                  var err = 'An error occurred when trying to save user to DB';
                                  console.log( err);
                                }else {

                                    console.log('User ' + user.username + ' successfully updated basicInfo.');
                                }
                            });
        					res.send([data.data]);
        			    })
        			    .catch(function (err) {
        			        console.log('An error ocurred when requesting the basics', err);
        			    });
                }else{
        			res.send(user.basicInfo);
        		}
    		}
    	});
    }else {
        console.log('No session found. Session cookie may be expired.');
        res.status(500).send('/end');
    }
};

exports.getFollowers = function (req, res) {
    if(req.session.cod != undefined){
        User.findOne({ cod: req.session.cod }, function(err, user) {
    		if (!user) {
                res.status(500).send('/end');
    		}else {
                res.locals.user = user;
    			var options = {
    	    	uri: 'https://api.instagram.com/v1/users/self/followed-by',
    	    	qs: {
    	        	access_token: user.token
    	    	},
    	    	headers: {
    	        	'User-Agent': 'Request-Promise'
    	    	},
    	    	json: true
    			};

        		rqst(options)
                .then(function (data) {
                    User.update({ cod: req.session.cod }, { followers: data.data }, options, function(err){
                        if(err){
                          var err = 'An error occurred when trying to save users followers';
                          console.log( err);
                        }else {
                            console.log('User ' + user.username + ' successfully updated followers.');
                        }
                    });
                    res.send(data.data);
                })
                .catch(function (err) {
                    console.log('An error ocurred when requesting the followers');
                });
    		}

        });
    }else {
        console.log('No session found. Session cookie may be expired.');
        res.status(500).send('/end');
    }
};

exports.getFollowings = function (req, res) {
    if(req.session.cod != undefined){
    	User.findOne({ cod: req.session.cod }, function(err, user) {
    		if (!user) {
                res.status(500).send('/end');
    		}else {
                res.locals.user = user;
    			var options = {
    	    	uri: 'https://api.instagram.com/v1/users/self/follows',
    	    	qs: {
    	        	access_token: user.token
    	    	},
    	    	headers: {
    	        	'User-Agent': 'Request-Promise'
    	    	},
    	    	json: true
    			};

                rqst(options)
                .then(function (data) {
                    User.update({ cod: req.session.cod }, { followings: data.data }, options, function(err){
                        if(err){
                          var err = 'An error occurred when trying to save users followings';
                          console.log( err);
                        }else {
                            console.log('User ' + user.username + ' successfully updated followings.');
                        }
                    });
                    res.send(data.data);
                })
                .catch(function (err) {
                    console.log('An error ocurred when requesting the followings');
                });
    		}
        });
    }else {
        console.log('No session found. Session cookie may be expired.');
        res.status(500).send('/end');
    }
};

exports.getNotRelated = function(req, res) {
    if(req.session.cod != undefined){
        User.findOne({ cod: req.session.cod }, function(err, user) {
    		if (!user) {
                res.status(500).send('/end');
    		}else {
                res.locals.user = user;
                var notFollowing = [];
                var notFollower = [];
                notFollowing = _.differenceWith(user.followers, user.followings, _.isEqual);
        		notFollower = _.differenceWith(user.followings, user.followers, _.isEqual);
        		user.notRelated = {
        			notFollowings: notFollowing,
        			notFollowers: notFollower
        		}
        		res.send(user.notRelated);
                user.save(function(err){
                  if(err){
                      var err = 'An error occurred when trying to save user to DB at getFollowings';
                      console.log(err);
                  }
                })
    		}

    	});
    }else {
        console.log('No session found. Session cookie may be expired.');
        res.status(500).send('/end');
    }
};

exports.getMedias = function (req, res) {
    if(req.session.cod != undefined){
        User.findOne({ cod: req.session.cod }, function(err, user) {
    		if (!user) {
                res.status(500).send('/end');
    		}else {
                res.locals.user = user;
                if (user.medias == null){
        			var options = {
        		    	uri: 'https://api.instagram.com/v1/users/self/media/recent/',
        		    	qs: {
        		        	access_token: user.token
        		    	},
        		    	headers: {
        		        	'User-Agent': 'Request-Promise'
        		    	},
        		    	json: true
        			};

                    rqst(options)
                    .then(function (data) {
                        User.update({ cod: req.session.cod }, { medias: data.data }, options, function(err){
                            if(err){
                              var err = 'An error occurred when trying to save users medias';
                              console.log( err);
                            }else {
                                console.log('User ' + user.username + ' successfully updated medias.');
                            }
                        });
                        res.send(data.data);
                    })
                    .catch(function (err) {
                        console.log('An error ocurred when requesting the medias');
                    });
                }else{
                    res.send(user.medias);
                }
    		}
        });
    }else {
        console.log('No session found. Session cookie may be expired.');
        res.status(500).send('/end');
    }
};

exports.getStats = function(req, res) {
    if(req.session.cod != undefined){
        User.findOne({ cod: req.session.cod }, function(err, user) {
    		if (!user) {
                res.status(500).send('/end');
    		}else {
                res.locals.user = user;
                var tags = []; //all tags
            	var dicTags = [];
            	var totalLikes = 0;
            	var location = [];
            	var dicLocal = [];
            	var tagged = [];
            	var dicTagged = [];

            	//tags
            	_.forEach(user.medias, function(media) {
            		_.forEach(media.tags, function(tag) {
            			tags.push(tag);
            		});
            	});

            	tags = _.countBy(tags);

            	_.forEach(tags, function(value, key) {
            		dicTags.push({
            			name: key,
            			freq: value
            		});
            	});

            	dicTags = _.orderBy(dicTags, 'freq', 'desc');

            	dicTags = _.slice(dicTags, 0, 10);

            	//location and total of likes
            	_.forEach(user.medias, function(media) {
            		totalLikes += media.likes.count;
            		if(media.location != null)
            			location.push(media.location.name);
            	});

            	location = _.countBy(location);

            	_.forEach(location, function(value, key) {
            		dicLocal.push({
            			name: key,
            			freq: value
            		});
            	});

            	dicLocal = _.orderBy(dicLocal, 'freq', 'desc');
            	dicLocal = _.slice(dicLocal, 0, 10);


            	//user tagged in the photos
            	_.forEach(user.medias, function(line) {
            		_.forEach(line.users_in_photo, function(u) {
            			tagged.push(u.user.username);
            		});
            	});

            	tagged = _.countBy(tagged);


            	_.forEach(tagged, function(value, key) {
            		dicTagged.push({
            			username: key,
            			freq: value
            		});
            	});

            	dicTagged = _.orderBy(dicTagged, 'freq', 'desc');
            	dicTagged = _.slice(dicTagged, 0, 10);

            	var stats = {
            		words: dicTags,
            		totalLikes: totalLikes,
            		places: dicLocal,
            		tagged_users: dicTagged
            	};
            	res.send(stats);
            }
        });
    }else {
        console.log('No session found. Session cookie may be expired.');
        res.status(500).send('/end');
    }
};

exports.changeRel = function (req, res){
    if(req.session.cod != undefined){
        User.findOne({ cod: req.session.cod }, function(err, user) {
    		if (!user) {
                res.status(500).send('/end');
    		}else {
                res.locals.user = user;
                var user_id = req.params.id;
                var action = req.params.action;

                ig.use({
                    client_id: api.client_id,
                    client_secret: api.client_secret,
                    access_token: user.token
                });
                ig.set_user_relationship(user_id, action, function(err, result, remaining, limit) {
                    if(err){
                        console.error(err.error_message);
                        res.send(err.error_message);
                    }else{
                        console.log(user.username, 'just changed relationship status with', user_id ,' to', result.outgoing_status,'.');
                        res.send(result);
                    }
                });
    		}


    	});
    }else {
        console.log('No session found. Session cookie may be expired.');
        res.status(500).send('/end');
    }
};


exports.finalize = function(req, res) {
    if (req.session.cod != undefined) {
        User.findOne({ cod: req.session.cod }, function(err, user) {
    		if (user) {
    			User.deleteOne({ cod: req.session.cod }, function (err) {
    				if(err){
    					console.log('User ',req.session.username, ' could not be deleted at the end of application', err);
                    }else {
                        console.log('End of session for %s.', req.session.username);
                    }
                });
    		}
    	});
    }
    console.log('End of session.');
	res.redirect('/');
};


//------------------------ ROUTES --------------------------

app.get('/end', exports.finalize);

// Authorization url
app.get('/login', exports.authorize_user);
// Redirect URI
app.get('/callback/', exports.handleauth);

app.get('/changeRel/:id/:action', exports.changeRel);

// Api methods callings
app.get('/data/user', exports.getBasicInfo);
app.get('/data/followers', exports.getFollowers);
app.get('/data/followings', exports.getFollowings);
app.get('/data/notrelated', exports.getNotRelated);
app.get('/data/medias', exports.getMedias);
app.get('/data/stats', exports.getStats);

app.listen(app.get('port'), function() {
	console.log('InstManager is now running on port', app.get('port'));
});
