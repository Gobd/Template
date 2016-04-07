angular.module('app')
  .controller('NavbarCtrl', function($scope, $auth) {
    $scope.isAuthenticated = function() {
      return $auth.isAuthenticated();
      // this function returns the user role, any string evals to true then we can check for role
    };
  });
