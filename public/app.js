var instApp = angular.module('instApp',['ngRoute']);

instApp.config(function($routeProvider){
	$routeProvider.when('/', {
		controller:'loginController',
		templateUrl: 'views/login.html'
	})
	$routeProvider.when('/main', {
		controller:'mainController',
		templateUrl: 'views/main.html'
	})
	$routeProvider.when('/relationships', {
		controller:'relationshipsController',
		templateUrl: 'views/relationships.html'
	})
	$routeProvider.when('/stats', {
		controller:'statsController',
		templateUrl: 'views/stats.html'
	})
	.otherwise({
		redirectTo: '/'
	});
});
