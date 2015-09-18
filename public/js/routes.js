angular.module("angularApp").config(function($routeProvider){
	$routeProvider.when("/issues/:issue", {
		templateUrl: "templates/pages/issue/",
		controller: "issueController"
	})
	.when("/candidates/:candidate", {
		templateUrl: "templates/pages/candidate/",
		controller: "candidateController"
	})
	.when("/", {
		templateUrl: "templates/pages/home/",
		controller: "homeController"
	})
	.otherwise({
		templateUrl: "templates/pages/home/",
		controller: "homeController"
	})
});