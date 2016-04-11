angular.module('app')
    .controller('addStuff', function ($scope, $auth, addStuffService) {

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
        // });

        $scope.addBus = function (addBusData) {
            addStuffService.addBus(addBusData).then(function (addedStuff) {
                $scope.response = addedStuff;
            })
        };

        $scope.addDeal = function (deal) {
            addStuffService.addDeal(deal).then(function (addedStuff) {
                console.log('addStuff ctrl');
                $scope.response = addedStuff;
            })
        };

    });
