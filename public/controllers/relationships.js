instApp = angular.module('instApp');

instApp.controller('relationshipsController', function($scope, $http, $location){

    console.log('relationshipsController loaded...');

    $scope.getUser = function(){
        $http.get('/data/user').then(function(response) {
            $scope.user = response.data[0];
        }, function(response){
			$location.url(response.data);
		})
    }


    var getRelated = function(){
        $http.get('/data/followers').then(function(response) {
            $scope.followers = response.data;
            $http.get('/data/followings').then(function(response) {
                $scope.followings = response.data;
                getNotRelated();
            }, function(response){
    			$location.url(response.data);
    		});
        }, function(response){
			$location.url(response.data);
		});
    }

    getRelated();
    $scope.getFollowers = function(){
        $http.get('/data/followers').then(function(response) {
            $scope.followers = response.data;
        }, function(response){
			$location.url(response.data);
		})
    }

    $scope.getFollowings = function(){
        $http.get('/data/followings').then(function(response) {
            $scope.followings = response.data;
        }, function(response){
			$location.url(response.data);
		})
    }

    var getNotRelated = function(){
        $http.get('/data/notrelated').then(function(response) {
            $scope.notFollowings = response.data.notFollowings;
            $scope.notFollowers = response.data.notFollowers;
        }, function(response){
			$location.url(response.data);
		})
    }

    $scope.getNotFollowings = function(){
        $http.get('/data/notrelated').then(function(response) {
            $scope.notFollowings = response.data.notFollowings;
            $scope.notFollowers = response.data.notFollowers;
        }, function(response){
			$location.url(response.data);
		})
    }

    $scope.unfollow = function() {
        var userId = this.person.id;
        $http.get('/changeRel/'+userId+'/unfollow').then(function(response) {
            $scope.unfol = response.data.outgoing_status;
            getRelated();
        })

    }

    $scope.follow = function() {
        var userId = this.person.id;
        var name = this.person.username;
        $http.get('/changeRel/'+userId+'/follow').then(function(response) {
            swal("You requested to follow " + name + ".", "We are waiting for " + name + " to accept your request.", "success")
            getRelated();
            changeText(userId, response.data.outgoing_status);
        }, function errorCallback(response) {
            console.log(response);
        })
    }

    function changeText(id, data){
        $("#"+id).prop("disabled",true);
        $("#"+id).text("Requested");
    }


});
