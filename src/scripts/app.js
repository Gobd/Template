angular.module('app', ['ui.router', 'satellizer'])

  .config(function($authProvider, $stateProvider, $urlRouterProvider) {

    $authProvider.facebook({
      clientId: '1670205403245071'
    });

    $authProvider.google({
      clientId: '696255640250-ha91c7enlsravhptab5c63punfunlh8u.apps.googleusercontent.com'
    });

    $urlRouterProvider.otherwise("/");

    $stateProvider
      .state('state1', {
        url: "/",
        templateUrl: "partials/register.html",
        controller: 'loginCtrl'
      });

  });
