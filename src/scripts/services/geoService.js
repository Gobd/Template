angular.module('app')
    .service('geoService', function ($http, $q) {

        var vm = this;

        function minuteToMs(min) {
            return min * 60000;
        }

        var options = {
            timeout: 4000,
            maximumAge: minuteToMs(60)
        };

        vm.getCurrentPosition = function () {
            var deferred = $q.defer();
            if (!navigator.geolocation) {
                deferred.reject('Geolocation not supported.');
            } else {
                navigator.geolocation.getCurrentPosition(
                    function (pos) {
                        deferred.resolve(pos.coords.latitude.toString() + ',' + pos.coords.longitude.toString());
                    },
                    function (err) {
                        deferred.reject(err);
                    }, options);
            }
            return deferred.promise;
        };

        vm.geoCode = function (address) {
            return $http({
                method: 'GET',
                params: {
                    address: address,
                    components: "components=country:US",
                    key: "AIzaSyDfbbD0QS-Ez9fLWI3lR8l6UkZ1VGWDLgQ"
                },
                url: 'https://maps.googleapis.com/maps/api/geocode/json'
            }).then(function (result) {
                return [result.data.results[0].geometry.location.lng, result.data.results[0].geometry.location.lat];
            });
        };

        vm.reverseGeoCode = function (latlng) {
            return $http({
                method: 'GET',
                params: {
                    latlng: latlng,
                    result_type: "locality",
                    language: "en",
                    location_type: "APPROXIMATE",
                    key: "AIzaSyDfbbD0QS-Ez9fLWI3lR8l6UkZ1VGWDLgQ"
                },
                url: 'https://maps.googleapis.com/maps/api/geocode/json'
            }).then(function (result) {
                return result.data.results[0].formatted_address.split(",").slice(0, -1).join(',');
            });
        }

    });
