var men = angular.module('men', []);
console.log("m here in angular men.js")

men.controller('men', function($scope, $http) {
	console.log("m here in angular men.js")
	$scope.unexpected_error = true;
	$scope.submit = function(){
		$http({
			method : "POST",
			url : '/allMen',
			data : {
				
				"allMen" : $scope.allMen
			}
		})
		
	}//end of all_men function












}) //end of controller