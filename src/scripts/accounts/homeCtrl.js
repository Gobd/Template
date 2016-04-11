angular.module('app')
    .controller('homeCtrl', function ($scope, $auth, geoService) {

        $scope.isAuthenticated = function () {
            return $auth.isAuthenticated();
        };

        // geoService.getCurrentPosition().then(function(latlng){
        //     geoService.reverseGeoCode(latlng).then(function(city){
        //         $scope.city = city;
        //         console.log(city);
        //     })
        // });

        // geoService.geoCode('295 E 7800 S 84047').then(function(latlng){
        //     console.log(latlng);
        // })

    });
