var instApp = angular.module('instApp');

instApp.controller('statsController', ['$scope', '$http', '$location', '$routeParams', function($scope, $http, $location, $routeParams){

	console.log('statsController loaded...');

	$scope.getUser = function(){
		$http.get('/data/user').then(function(response) {
			$scope.user = response.data;
		})
	}

	$scope.getTags = function(){
		$http.get('/data/tags').then(function(response) {
			$scope.tags = response.data;
		})
	}
}]);
