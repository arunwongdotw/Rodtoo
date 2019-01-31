appControllers.controller('cusMapCtrl', function($scope, $state, $stateParams, deviceService, $rootScope, $ionicPlatform, $interval, $timeout, $http, myService, $mdDialog, $mdSidenav, $ionicHistory) {
  $scope.cLocation = {};
  var map, marker, marker2, myLatLng, desLatLng, directionsService, directionsDisplay, mapOptions;

  $scope.btnBack = function() {
    clearSetInterval();
    $state.go("logincus.cusbookinglist");
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
    // desLatLng = new google.maps.LatLng(8.437786, 99.970234);
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

  function updateVanMarker() {
    desLatLng = new google.maps.LatLng($scope.vanPosition.position_latitude, $scope.vanPosition.position_longitude);
    marker2.setPosition(desLatLng);
  }

  function updateUserMarker() {
    myLatLng = new google.maps.LatLng($scope.cLocation.latitude, $scope.cLocation.longitude);
    marker.setPosition(myLatLng);
  }

  function getVanPosition(callback) {
    $http.get(myService.configAPI.webserviceURL + 'webservices/getVanPosition.php?vanid=' + myService.vanDetail.van_id)
      .then(function(response) {
        $scope.vanPosition = response.data.results[0];
        getVanMemberDetail(function(status) {
          callback();
        });
      });
  }

  function getVanMemberDetail(callback) {
    $http.get(myService.configAPI.webserviceURL + 'webservices/getVanMemberDetail.php?memberid=' + $scope.vanPosition.van_member_id)
      .then(function(response) {
        $scope.vanMemberDetail = response.data.results[0];
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

  function fnInitMap() {
    getCurrentLocation(function(status) {
      getVanPosition(function(status) {
        googleMap();
      });
    });
  }

  $ionicPlatform.ready(function() {
    $scope.initMap();
    $scope.updatePosition = setInterval(function() {
      getCurrentLocation(function(status) {
        updateUserMarker();
        getVanPosition(function(status) {
          updateVanMarker();
        });
      });
    }, 60000);
  });

  function clearSetInterval() {
    clearInterval($scope.updatePosition);
  }

  $scope.btnRefresh = function() {
    clearInterval();
    fnInitMap();
    $scope.updatePosition = setInterval(function() {
      getCurrentLocation(function(status) {
        updateUserMarker();
        getVanPosition(function(status) {
          updateVanMarker();
        });
      });
    }, 60000);
  };

  $ionicPlatform.registerBackButtonAction(function() {
    if ($mdSidenav("left").isOpen()) {
      $mdSidenav('left').close();
    } else if (jQuery('md-bottom-sheet').length > 0) {
      $mdBottomSheet.cancel();
    } else if (jQuery('[id^=dialog]').length > 0) {
      $mdDialog.cancel();
    } else if (jQuery('md-menu-content').length > 0) {
      $mdMenu.hide();
    } else if (jQuery('md-select-menu').length > 0) {
      $mdSelect.hide();
    } else {
      if ($state.current.name == 'logincus.cusprofile') {
        if (jQuery('[id^=dialog]').length == 0) {
          $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            targetEvent: null,
            locals: {
              displayOption: {
                title: "ออกจากแอปพลิเคชัน ?",
                content: "คุณแน่ใจที่จะออกจากแอปพลิเคชัน",
                ok: "ยืนยัน",
                cancel: "ยกเลิก"
              }
            }
          }).then(function(response) {
            ionic.Platform.exitApp();
          });
        }
      } else {
        clearSetInterval();
        $ionicHistory.goBack();
      }
    }
  }, 100);
});
