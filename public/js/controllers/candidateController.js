angular.module("angularApp")
.controller("candidateController", ["$scope", "$http", "$routeParams", "$rootScope", function($scope, $http, $routeParams, $rootScope){
	
	// Set "done" loading to false
	$rootScope.done = false;
	
	// Close nav tray
	$scope.$parent.showNav = false;
	
	// Get candidate
	$http.get("/api/candidates/" + $routeParams.candidate).success(function(data){
		$scope.candidate = data;

		$scope.title = "Where " + $scope.candidate.name + " stands on all the issues";
		$scope.$parent.pageTitle = $scope.candidate.name;

		// Set "done" loading to true
		$rootScope.done = true;
	});
	
	
}]);
