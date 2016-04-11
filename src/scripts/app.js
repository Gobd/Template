angular.module('app', ['ui.router', 'satellizer'])

    .config(function ($authProvider, $stateProvider, $urlRouterProvider, $locationProvider) {

        $authProvider.facebook({
            clientId: '1670205403245071'
        });

        $authProvider.google({
            clientId: '696255640250-ha91c7enlsravhptab5c63punfunlh8u.apps.googleusercontent.com'
        });

        $urlRouterProvider.otherwise("/");

        $stateProvider
            .state('home', {
                url: '/',
                controller: 'homeCtrl',
                templateUrl: 'partials/home.html'
            })
            .state('login', {
                url: '/login',
                templateUrl: 'partials/login.html',
                controller: 'loginCtrl',
                resolve: {
                    skipIfLoggedIn: skipIfLoggedIn
                }
            })
            .state('signup', {
                url: '/signup',
                templateUrl: 'partials/signup.html',
                controller: 'signupCtrl',
                resolve: {
                    skipIfLoggedIn: skipIfLoggedIn
                }
            })
            .state('logout', {
                url: '/logout',
                template: null,
                controller: 'logoutCtrl'
            })
            .state('profile', {
                url: '/profile',
                templateUrl: 'partials/profile.html',
                controller: 'profileCtrl',
                resolve: {
                    loginRequired: loginRequired
                }
            })
            .state('addStuff', {
                url: '/addstuff',
                templateUrl: 'partials/addStuff.html',
                controller: 'addStuff',
                resolve: {
                    loginRequired: loginRequired
                }
            });


        function skipIfLoggedIn($q, $auth) {
            var deferred = $q.defer();
            if ($auth.isAuthenticated()) {
                deferred.reject();
            } else {
                deferred.resolve();
            }
            return deferred.promise;
        }

        function loginRequired($q, $location, $auth) {
            var deferred = $q.defer();
            if ($auth.isAuthenticated()) {
                deferred.resolve();
            } else {
                $location.path('/login');
            }
            return deferred.promise;
        }

    });
