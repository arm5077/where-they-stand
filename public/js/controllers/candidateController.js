angular.module("angularApp")
.controller("candidateController", ["$scope", "$http", "$routeParams", function($scope, $http, $routeParams){
	
	// Close nav tray
	$scope.$parent.showNav = false;
	
	// Get candidate
	$http.get("/api/candidates/" + $routeParams.candidate).success(function(data){
		$scope.candidate = data;

		$scope.title = "Where " + $scope.candidate.name + " stands on all the issues";
		$scope.$parent.pageTitle = $scope.candidate.name;
	});
	
	
}]);
