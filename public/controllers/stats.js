var instApp = angular.module('instApp');

instApp.controller('statsController', ['$scope', '$http', '$location', '$routeParams', function($scope, $http, $location, $routeParams){

	console.log('statsController loaded...');

	$scope.getUser = function(){
		$http.get('/data/user').then(function(response) {
			$scope.user = response.data[0];
		}, function(response){
			$location.url(response.data);
		})
	}

    $scope.getStats = function(){
        $http.get('/data/stats').then(function(response) {
			$scope.tags = response.data.words;
			$scope.taggedUsers = response.data.tagged_users;
            $scope.places = response.data.places;
            $scope.totalLikes = response.data.totalLikes;
            console.log(response.data);
        }, function(response){
			$location.url(response.data);
		})
    }
}]);
