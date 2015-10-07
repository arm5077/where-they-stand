angular.module("angularApp")
.controller("homeController", ["$scope", "$http", "$routeParams", "$location", "$rootScope", function($scope, $http, $routeParams, $location, $rootScope){	
	
	// Set "done" loading to false
	$rootScope.done = false;
	
	var timer = setInterval(function(){
		if($scope.$parent.candidates.length > 0 && $scope.$parent.issues.length > 0){
			$rootScope.done = true;
			console.log("boboobobobob");
			clearInterval(timer);
		}
	}, 250)
	
	$scope.candidates = $scope.$parent.candidates;
	$scope.issues = $scope.$parent.issues;
}]);
