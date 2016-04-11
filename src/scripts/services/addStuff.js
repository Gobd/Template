angular.module('app')
    .service('addStuffService', function ($http, geoService) {

        var vm = this;

        // geoService.getCurrentPosition().then(function(latlng){
        //     geoService.reverseGeoCode(latlng).then(function(city){
        //         $scope.city = city;
        //         console.log(city);
        //     })
        // });
        //
        // geoService.geoCode('295 E 7800 S 84047').then(function(latlng){
        //     console.log(latlng);
        // });

        vm.addBus = function (addBus) {
            return geoService.geoCode(addBus.bus.address).then(function (lnglat) {
                var loc = {
                    type: "Point",
                    coordinates: lnglat
                };
                addBus.bus.loc = loc;
                addBus.deal.loc = loc;
                addBus.deal.address = addBus.bus.address;
                addBus.deal.day = [addBus.deal.day];
                return $http({
                    method: 'POST',
                    data: addBus,
                    url: '/api/bus'
                })
            });
        };

        vm.addDeal = function (deal) {
            //we need to add geolocation and address to this before it will save
            // the user will probably have those and we can grab them then
            return $http({
                method: 'POST',
                data: deal,
                url: '/api/deal'
            })
        };

    });
