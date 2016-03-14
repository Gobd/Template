angular.module('app').controller('loginCtrl', function($scope, $auth){

    $scope.authenticate = function(provider) {
        $auth.authenticate(provider);
    };

    $scope.tester = 'hey from login';

$scope.signup = function(user){
  $auth.signup(user)
    .then(function(response) {
      $auth.setToken(response);
      // Redirect user here to login page or perhaps some other intermediate page
      // that requires email address verification before any other part of the site
      // can be accessed.
    })
    .catch(function(response) {
      // Handle errors here.
    });
};


  });
