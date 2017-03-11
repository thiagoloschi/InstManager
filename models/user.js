module.exports = function ( id, basicInfo, followers, followings, notFollowings, notFollowers, medias, tags) {
    this.id = id;
	this.basicInfo = basicInfo;
	this.followers = followers;
	this.followings = followings;
	this.notFollowings = notFollowings;
    this.notFollowers = notFollowers;
	this.medias = medias;
    this.tags = tags;
};
