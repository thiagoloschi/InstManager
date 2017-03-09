instApp = angular.module('instApp');

instApp.controller('relationshipsController', ['$scope', '$http', '$location', '$routeParams', function($scope, $http, $location, $routeParams){

    console.log('relationshipsController loaded...');

    $scope.getUser = function(){
        $http.get('/data/user').then(function(response) {
            $scope.user = response.data;
        })
    }

    $scope.getFollowers = function(){
        $http.get('/data/followers').then(function(response) {
            $scope.followers = response.data;
        })
    }

    $scope.getFollowings = function(){
        $http.get('/data/followings').then(function(response) {
            $scope.followings = response.data;
            console.log($scope.followings);
        })
    }

    $scope.getNotFollowings = function(){
        $http.get('/data/notfollowings').then(function(response) {
            $scope.notFollowings = response.data;
            console.log($scope.notFollowings);
        })
    }

    $scope.getNotFollowers = function(){
        $http.get('/data/notfollowers').then(function(response) {
            $scope.notFollowers = response.data;
            console.log($scope.notFollowers);
        })
    }

}]);
