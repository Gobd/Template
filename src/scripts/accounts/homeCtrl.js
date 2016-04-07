angular.module('app')
  .controller('homeCtrl', function($scope, $auth) {

$scope.test = 'test'

  $scope.isAuthenticated = function() {
    return $auth.isAuthenticated();
  };

  });
