angular.module("angularApp", [])
.controller("overallController", ["$scope", "$http", "$sce", function($scope, $http, $sce){
	//test
	$scope.selectionToggle = 'candidates';
	
	// Get candidates
	$http.get("/api/candidates").success(function(data){
		$scope.candidates = data;
	});
	
	// Get issues
	$http.get("/api/issues").success(function(data){
		$scope.issues = data;
	});
	
}]);