angular.module("angularApp")
.controller("issueController", ["$scope", "$http", "$routeParams", "$location", "$rootScope", function($scope, $http, $routeParams, $location, $rootScope){
	
	console.log($routeParams.issue);
	// Get issue
	$http.get("/api/issues/" + $routeParams.issue).success(function(data){
		$scope.issue = data;
	});
}]);
