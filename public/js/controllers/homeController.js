angular.module("angularApp")
.controller("homeController", ["$scope", "$http", "$routeParams", "$location", "$rootScope", function($scope, $http, $routeParams, $location, $rootScope){
	$scope.candidates = $scope.$parent.candidates;
	$scope.issues = $scope.$parent.issues;
}]);
