appControllers.controller('cusMapCtrl', function($scope, $state, $stateParams, deviceService, $rootScope, $ionicPlatform, $interval, $timeout, $http, myService, $mdDialog) {
  $scope.cLocation = {};
  $scope.dLocation = {};
  var map, marker, marker2, myLatLng, desLatLng, directionsService, directionsDisplay, mapOptions;

  $scope.btnBack = function() {
    $scope.navigateTo('logincus.cusbookinglist');
  };

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
    desLatLng = new google.maps.LatLng($scope.vanPosition.position_latitude, $scope.vanPosition.position_longitude);
    // desLatLng = new google.maps.LatLng(8.439857, 99.961636);
    mapOptions = {
      zoom: 15,
      center: myLatLng
    };
    map = new google.maps.Map(document.getElementById("map"), mapOptions);
    marker = new google.maps.Marker({
      position: myLatLng,
      map: map,
      label: 'คุณ'
    });
    marker2 = new google.maps.Marker({
      position: desLatLng,
      map: map,
      label: $scope.vanPosition.van_plate_no
    });
    directionsDisplay.setMap(map);
  }

  function updateMarker() {
    desLatLng = new google.maps.LatLng($scope.vanPosition.position_latitude, $scope.vanPosition.position_longitude);
    marker2.setPosition(desLatLng);
  }

  function getVanPosition(callback) {
    $http.get(myService.configAPI.webserviceURL + 'webservices/getVanPosition.php?vanid=' + myService.vanDetail.van_id)
      .then(function(response) {
        $scope.vanPosition = response.data.results[0];
        callback();
      });
  }

  $scope.initMap = function() {
    getCurrentLocation(function(status) {
      getVanPosition(function(status) {
        googleMap();
      });
    });
  };

  $ionicPlatform.ready(function() {
    $scope.initMap();
    setInterval(function() {
      getVanPosition(function(status) {
        updateMarker();
      });
    }, 60000);
  });
});
