app = angular.module("opinionApp", []);

app.controller("opinionController", ["$scope", "$sce", function($scope, $sce){
	
	$scope.issues = data.issues;
	$scope.renderHTML = function(text){ return $sce.trustAsHtml(text); };
	
	$scope.getImage = function(name){
		
		return {"background-image": "url('" + data.opinionators.map(function(datum){ if ( datum.name == name ) return datum.img })[0] + "')"};
	};
	
}]);