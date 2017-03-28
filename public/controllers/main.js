var instApp = angular.module('instApp');

instApp.controller('mainController', ['$scope', '$http', '$location', '$routeParams', function($scope, $http, $location, $routeParams){

	console.log('mainController loaded...');

	$scope.getUser = function(){
		$http.get('/data/user').then(function(response) {
			$scope.user = response.data[0];
		})
	}

	$scope.getMedias = function(){
		$http.get('/data/medias').then(function(response) {
			$scope.medias = response.data;
		})
	}
}]);
