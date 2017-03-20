instApp = angular.module('instApp');

instApp.controller('relationshipsController', ['$scope', '$http', '$location', '$routeParams', function($scope, $http, $location, $routeParams){

    console.log('relationshipsController loaded...');

    $scope.getUser = function(){
        $http.get('/data/user').then(function(response) {
            $scope.user = response.data[0];
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
        })
    }

    $scope.getNotFollowings = function(){
        $http.get('/data/notrelated').then(function(response) {
            $scope.notFollowings = response.data.notFollowings;
            $scope.notFollowers = response.data.notFollowers;
            console.log(response.data);
        })
    }

}]);
