angular.module("angularApp")
.controller("homeController", ["$scope", "$http", "$routeParams", "$location", "$rootScope", function($scope, $http, $routeParams, $location, $rootScope){	
	
	// Set "done" loading to false
	$rootScope.done = false;
	
	var timer = setInterval(function(){
		console.log("candidates length " + $scope.$parent.issues.length);
		if($scope.$parent.candidates.length > 0 && $scope.$parent.issues.length > 0){
			$scope.$apply(function(){
				$rootScope.done = true;
			});
			clearInterval(timer);
		}
	}, 250);

	$rootScope.showHeader = false;
	$scope.candidates = $scope.$parent.candidates;
	$scope.issues = $scope.$parent.issues;
}]);
