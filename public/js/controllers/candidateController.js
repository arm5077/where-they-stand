angular.module("angularApp")
.controller("candidateController", ["$scope", "$http", "$routeParams", function($scope, $http, $routeParams){
	
	console.log($routeParams.candidate);
	// Get candidate
	$http.get("/api/candidates/" + $routeParams.candidate).success(function(data){
		$scope.candidate = data;
		console.log(data);
	});
	
	
}]);
