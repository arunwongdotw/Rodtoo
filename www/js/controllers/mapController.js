appControllers.controller('mapCtrl', function($scope, $state, $stateParams, deviceService, $rootScope, $ionicPlatform, $interval) {
  // $scope.fakeLocation = {};
  // $scope.cLocation = {};

  // $scope.fakeLocation.latitude = 8.443231;
  // $scope.fakeLocation.longitude = 99.957052;
  //
  // $scope.cLocation.latitude = 8.4426769;
  // $scope.cLocation.longitude = 99.9556992;

  // $interval(function() {
  //   $scope.getLocation();
  // }, 60000);
  //
  // $scope.getLocation = function() {
  //   getCurrentLocation(function(status) {
  //     $scope.fakeLocation.latitude = 8.443231;
  //     $scope.fakeLocation.longitude = 99.957052;
  //     $scope.initMap($scope.fakeLocation, $scope.cLocation);
  //   });
  // };

  function getCurrentLocation(callback) {
    deviceService.checkGPS(function(status) {
      if (status == 'GPS_OFF') {
        deviceService.checkPlatform(function(device) {
          if (device == 'android') {
            deviceService.androidGpsSetting(function(status) {
              if (status == 'force_gps') {
                deviceService.currentLocation(function(data) {
                  if (data != 'ERROR_POSITION') {
                    $rootScope.currentLocation = data;
                    // $scope.mapStatus = true;
                    $scope.cLocation.latitude = data.latitude;
                    $scope.cLocation.longitude = data.longitude;
                    callback($scope.cLocation);
                  }
                });
              } else {
                deviceService.openSetting(function(status) {});
              }
            });
          } else if (device == 'ios') {
            deviceService.openSetting(function(status) {
              if (status == 'OPENED_SETTING') {
                deviceService.currentLocation(function(data) {
                  if (data != 'ERROR_POSITION') {
                    $rootScope.currentLocation = data;
                    // $scope.mapStatus = true;
                    $scope.cLocation.latitude = data.latitude;
                    $scope.cLocation.longitude = data.longitude;
                    callback($scope.cLocation);
                  }
                });
              }
            });
          } else {
            alert('ERROR Deivice not in ios & android');
          }
        });
      } else {
        deviceService.currentLocation(function(data) {
          if (data != 'ERROR_POSITION') {
            $rootScope.currentLocation = data;
            // $scope.mapStatus = true;
            $scope.cLocation.latitude = data.latitude;
            $scope.cLocation.longitude = data.longitude;
            callback($scope.cLocation);
          }
        });
      }
    });
  }

  // $scope.initMap = function(destination, origin) {
  //   var directionsService = new google.maps.DirectionsService();
  //   var directionsDisplay = new google.maps.DirectionsRenderer();
  //   var myLatlng = new google.maps.LatLng(destination.latitude, destination.longitude);
  //   var map = new google.maps.Map(document.getElementById('map'), {
  //     zoom: 15,
  //     center: myLatlng
  //   });
  //   directionsDisplay.setMap(map);
  //   directionsService.route({
  //     origin: origin.latitude + "," + origin.longitude,
  //     destination: destination.latitude + "," + destination.longitude,
  //     travelMode: 'DRIVING'
  //   }, function(response, status) {
  //     if (status === 'OK') {
  //       directionsDisplay.setDirections(response);
  //     } else {
  //       console.log('Directions request failed due to ' + status);
  //     }
  //   });
  // };

  $scope.initMap = function() {
    console.log('test');
    var directionsService = new google.maps.DirectionsService();
    var directionsDisplay = new google.maps.DirectionsRenderer();
    var myLatlng = new google.maps.LatLng(8.443231, 99.957052);
    var mapOptions = {
      zoom: 15,
      center: myLatlng
    };
    var map = new google.maps.Map(document.getElementById('map'), mapOptions);
    directionsDisplay.setMap(map);
    // directionsService.route({
    //   origin: "8.4426769, 99.9556992",
    //   destination: "8.443231, 99.957052",
    //   travelMode: 'DRIVING'
    // }, function(response, status) {
    //   if (status === 'OK') {
    //     directionsDisplay.setDirections(response);
    //   }
    // });
  };

  $scope.initMap();
});
