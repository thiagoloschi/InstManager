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
	$routeProvider.when('/terms', {
		controller:'statsController',
		templateUrl: 'views/terms.html'
	})
	$routeProvider.when('/privacy', {
		controller:'statsController',
		templateUrl: 'views/privacy.html'
	})
	$routeProvider.when('/developer', {
		controller:'statsController',
		templateUrl: 'views/developer.html'
	})
	.otherwise({
		redirectTo: '/'
	});
});
