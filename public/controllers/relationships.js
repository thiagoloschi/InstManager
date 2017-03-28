instApp = angular.module('instApp');

instApp.controller('relationshipsController', function($scope, $http){

    console.log('relationshipsController loaded...');

    $scope.getUser = function(){
        $http.get('/data/user').then(function(response) {
            $scope.user = response.data[0];
        })
    }


    var getRelated = function(){
        $http.get('/data/followers').then(function(response) {
            $scope.followers = response.data;
            $http.get('/data/followings').then(function(response) {
                $scope.followings = response.data;
                getNotRelated();
            });
        });
    }

    getRelated();
    $scope.getFollowers = function(){
        $http.get('/data/followers').then(function(response) {
            $scope.followers = response.data;
        })
    }

    $scope.getFollowings = function(){
        $http.get('/data/followings').then(function(response) {
            $scope.followings = response.data;
        })
    }

    var getNotRelated = function(){
        $http.get('/data/notrelated').then(function(response) {
            $scope.notFollowings = response.data.notFollowings;
            $scope.notFollowers = response.data.notFollowers;
        })
    }

    $scope.getNotFollowings = function(){
        $http.get('/data/notrelated').success(function(response) {
            $scope.notFollowings = response.data.notFollowings;
            $scope.notFollowers = response.data.notFollowers;
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
        $http.get('/changeRel/'+userId+'/follow').then(function(response) {
            console.log('foi');
            getRelated();
            changeText(userId, response.data.outgoing_status);
        }, function errorCallback(response) {
            console.log(response);
        })
    }

    function changeText(id, data){
        $("#"+id).text("Requested");
    }



    $(document).on("click", ".follow-button", function () {
        var userId = $(this).data('id');
        $(".modal-body #userId").html('<a href="/changeRel/'+userId+'/follow" role="button">Yes</a>');
    });

});
