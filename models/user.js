var mongoose = require('mongoose');

//User Schema
var userSchema = mongoose.Schema({
    cod: Number,
    username: String,
    token: String,
    basicInfo: Array,
	followers: Array,
	followings: Array,
	notRelated: {
        notFollowers: Array,
        notFollowings: Array
    },
	medias: Array
});

//Makes object acessible from outside
var User = module.exports = mongoose.model('User', userSchema);
