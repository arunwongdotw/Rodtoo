appControllers.controller('vanMapCtrl', function($scope, $state, $stateParams, deviceService, $rootScope, $ionicPlatform, $interval, $timeout, $http, myService, $mdDialog, $mdSidenav) {
  $scope.cLocation = {};
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
    mapOptions = {
      zoom: 15,
      center: myLatLng
    };
    map = new google.maps.Map(document.getElementById("map"), mapOptions);
    marker = new google.maps.Marker({
      position: myLatLng,
      map: map,
      label: $scope.vanDetail.van_plate_no
    });
    directionsDisplay.setMap(map);
  }

  function updateMarker() {
    myLatLng = new google.maps.LatLng($scope.cLocation.latitude, $scope.cLocation.longitude);
    marker.setPosition(myLatLng);
    map.setCenter(myLatLng);
  }

  $scope.initMap = function() {
    getCurrentLocation(function(status) {
      googleMap();
    });
  };

  $ionicPlatform.ready(function() {
    $http.get(myService.configAPI.webserviceURL + 'webservices/getVanDetail2.php?memberid=' + myService.memberDetailFromLogin.member_id)
      .then(function(response) {
        $scope.vanDetail = response.data.results[0];
      });
    $scope.initMap();
  });

  function updatePosition(callback) {
    $http({
      url: myService.configAPI.webserviceURL + 'webservices/updatePosition.php',
      method: 'POST',
      data: {
        var_vanid: $scope.vanDetail.van_id,
        var_latitude: $scope.cLocation.latitude,
        var_longitude: $scope.cLocation.longitude,
        var_status: "2"
      }
    }).then(function(response) {
      callback();
    }, function(error) {
      $mdDialog.show({
        controller: 'DialogController',
        templateUrl: 'confirm-dialog.html',
        locals: {
          displayOption: {
            title: "เกิดข้อผิดพลาด !",
            content: "เกิดข้อผิดพลาด updatePosition ใน vanMapController ระบบจะปิดอัตโนมัติ",
            ok: "ตกลง"
          }
        }
      }).then(function(response) {
        ionic.Platform.exitApp();
      });
    });
  }

  function updatePositionStatus(callback) {
    $http({
      url: myService.configAPI.webserviceURL + 'webservices/updatePositionStatus.php',
      method: 'POST',
      data: {
        var_vanid: $scope.vanDetail.van_id,
        var_status: "1"
      }
    }).then(function(response) {
      callback();
    }, function(error) {
      $mdDialog.show({
        controller: 'DialogController',
        templateUrl: 'confirm-dialog.html',
        locals: {
          displayOption: {
            title: "เกิดข้อผิดพลาด !",
            content: "เกิดข้อผิดพลาด updatePositionStatus ใน vanMapController ระบบจะปิดอัตโนมัติ",
            ok: "ตกลง"
          }
        }
      }).then(function(response) {
        ionic.Platform.exitApp();
      });
    });
  }

  function clearSetInterval() {
    clearInterval($scope.updatePosition);
  }

  $scope.btnStart = function() {
    $mdDialog.show({
      controller: 'DialogController',
      templateUrl: 'confirm-dialog.html',
      locals: {
        displayOption: {
          title: "ออกเดินทาง ?",
          content: "คุณแน่ใจที่จะออกเดินทาง",
          ok: "ตกลง",
          cancel: "ยกเลิก"
        }
      }
    }).then(function(response) {
      $http.get(myService.configAPI.webserviceURL + 'php_push/vanMapNotification.php?memberid=' + myService.memberDetailFromLogin.member_id);
      $scope.updatePosition = setInterval(function() {
        getCurrentLocation(function(status) {
          // $scope.cLocation.longitude = $scope.cLocation.longitude - 0.001;
          // console.log($scope.cLocation.longitude);
          updatePosition(function(status) {
            updateMarker();
          });
        });
      }, 60000);
    });
  };

  $scope.btnStop = function() {
    $mdDialog.show({
      controller: 'DialogController',
      templateUrl: 'confirm-dialog.html',
      locals: {
        displayOption: {
          title: "หยุดเดินทาง ?",
          content: "คุณแน่ใจที่จะหยุดเดินทาง",
          ok: "ตกลง",
          cancel: "ยกเลิก"
        }
      }
    }).then(function(response) {
      updatePositionStatus(function(status) {
        clearSetInterval();
        $mdDialog.show({
          controller: 'DialogController',
          templateUrl: 'confirm-dialog.html',
          locals: {
            displayOption: {
              title: "หยุดการเดินทางสำเร็จ !",
              content: "คุณหยุดการเดินทางสำเร็จ",
              ok: "ตกลง"
            }
          }
        });
      });
    });
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
      if ($state.current.name == 'loginvan.vanmap') {
        if (jQuery('[id^=dialog]').length == 0) {
          $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            targetEvent: null,
            locals: {
              displayOption: {
                title: "ออกจากแอปพลิเคชัน",
                content: "คุณแน่ใจที่จะออกจากแอปพลิเคชัน ?",
                ok: "ยืนยัน",
                cancel: "ยกเลิก"
              }
            }
          }).then(function(response) {
            ionic.Platform.exitApp();
          });
        }
      } else {
        $ionicHistory.goBack();
      }
    }
  }, 100);
});
