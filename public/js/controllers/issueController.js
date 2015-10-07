angular.module("angularApp")
.controller("issueController", ["$scope", "$http", "$routeParams", "$location", "$rootScope", function($scope, $http, $routeParams, $location, $rootScope){
	
	// Set "done" loading to false
	$rootScope.done = false;
	
	// Close nav tray
	$scope.$parent.showNav = false;
	
	// Get issue
	$http.get("/api/issues/" + $routeParams.issue).success(function(data){
		$scope.issue = data;
		
		// Set title
		$rootScope.title = "The 2016 Candidates on " + $scope.issue.title;
		$scope.$parent.pageTitle = $scope.issue.title;
		
		// Set "done" loading to true
		$rootScope.done = true;
		
	});

}]);
