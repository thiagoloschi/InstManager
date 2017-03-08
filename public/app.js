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
	.otherwise({
		redirectTo: '/'
	});
});