app = angular.module("opinionApp", []);

app.controller("opinionController", ["$scope", "$sce", function($scope, $sce){
	
	$scope.issues = data.issues;
	$scope.renderHTML = function(text){ return $sce.trustAsHtml(text); };
	
	$scope.getImage = function(name){
		for( i=0; i< data.opinionators.length; i++){
			if( data.opinionators[i].name == name)
				return {"background-image": "url('" + data.opinionators[i].img + "')"};
		}

	};
	
}]);