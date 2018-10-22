appControllers.controller('mapCtrl', function($scope, $state, $stateParams, deviceService, $rootScope, $ionicPlatform, $interval, $timeout) {
  $scope.cLocation = {};
  $scope.dLocation = {};
  $scope.dLocation.latitude = 8.439857;
  $scope.dLocation.longitude = 99.961636;
  var map, marker, marker2, myLatLng, desLatLng, directionsService, directionsDisplay, mapOptions;

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
            $scope.cLocation.latitude = data.latitude;
            $scope.cLocation.longitude = data.longitude;
            callback($scope.cLocation);
          }
        });
      }
    });
  }

  function googleMap() {
    directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer();
    myLatLng = new google.maps.LatLng($scope.cLocation.latitude, $scope.cLocation.longitude);
    desLatLng = new google.maps.LatLng($scope.dLocation.latitude, $scope.dLocation.longitude);
    mapOptions = {
      zoom: 15,
      center: myLatLng
    };
    map = new google.maps.Map(document.getElementById("map"), mapOptions);
    marker = new google.maps.Marker({
      position: myLatLng,
      map: map,
      label: 'origin'
    });
    marker2 = new google.maps.Marker({
      position: desLatLng,
      map: map,
      label: 'des'
    });
    directionsDisplay.setMap(map);
    // directionsService.route({
    //   origin: myLatLng,
    //   destination: desLatLng,
    //   travelMode: 'DRIVING'
    // }, function(response, status) {
    //   if (status === 'OK') {
    //     directionsDisplay.setDirections(response);
    //   } else {
    //     console.log('Directions request failed due to ' + status);
    //   }
    // });
  }

  function updateMarker() {
    desLatLng = new google.maps.LatLng($scope.dLocation.latitude, $scope.dLocation.longitude);
    marker2.setPosition(desLatLng);
  }

  $scope.initMap = function() {
    getCurrentLocation(function(status) {
      googleMap();
    });
  };

  $ionicPlatform.ready(function() {
    $scope.initMap();
    setInterval(function() {
      $scope.dLocation.longitude = $scope.dLocation.longitude - 0.001;
      updateMarker();
    }, 10000);
  });
});
