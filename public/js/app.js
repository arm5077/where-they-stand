angular.module("angularApp", ['ngRoute', 'pc035860.scrollWatch'])
.controller("overallController", ["$scope", "$http", "$sce", function($scope, $http, $sce){
		
	$scope.renderHTML = function(text){ return $sce.trustAsHtml(text); };	
	$scope.pageTitle = "National Journal";
	$scope.moment = moment;
	
	// Get candidates
	$http.get("/api/candidates").success(function(data){
		$scope.candidates = data;
		console.log(data);
	});
	
	// Get issues
	$http.get("/api/issues").success(function(data){
		$scope.issues = data;
	});
	
}])
.directive("center", function(){
	return {
		link: function(scope, element, attr) {
			console.log(window.innerHeight);
			element[0].style.marginTop = ((window.innerHeight - element[0].offsetHeight) / 2) + "px"
		}
	};	
});