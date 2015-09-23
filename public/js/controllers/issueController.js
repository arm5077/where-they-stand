angular.module("angularApp")
.controller("issueController", ["$scope", "$http", "$routeParams", "$location", "$rootScope", function($scope, $http, $routeParams, $location, $rootScope){
	
	// Close nav tray
	$scope.$parent.showNav = false;
	
	// Get issue
	$http.get("/api/issues/" + $routeParams.issue).success(function(data){
		$scope.issue = data;
		
		// Set title
		$scope.title = "The 2016 Candidates on " + $scope.issue.title;

	});

}]);
