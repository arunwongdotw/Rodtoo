appControllers.controller('mapCtrl', function($scope, $state, $stateParams, deviceService, $rootScope, $ionicPlatform, $interval, $timeout, $http, myService, $mdDialog, $mdSidenav) {
  var map, marker, marker2, myLatLng, desLatLng, directionsService, directionsDisplay, mapOptions;

  $scope.btnBack = function() {
    clearSetInterval();
    $scope.navigateTo('notlogin.login');
  };

  function clearSetInterval() {
    clearInterval($scope.updatePosition);
  }

  function googleMap() {
    directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer();
    desLatLng = new google.maps.LatLng($scope.vanPosition.position_latitude, $scope.vanPosition.position_longitude);
    mapOptions = {
      zoom: 15,
      center: desLatLng
    };
    map = new google.maps.Map(document.getElementById("map"), mapOptions);
    marker = new google.maps.Marker({
      position: desLatLng,
      map: map,
      label: $scope.vanPosition.van_plate_no
    });
    directionsDisplay.setMap(map);
  }

  function updateVanMarker() {
    console.log($scope.vanPosition.position_latitude);
    console.log($scope.vanPosition.position_longitude);
    desLatLng = new google.maps.LatLng($scope.vanPosition.position_latitude, $scope.vanPosition.position_longitude);
    marker.setPosition(desLatLng);
    map.setCenter(desLatLng);
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

  function getVanPosition2(callback) {
    $http.get(myService.configAPI.webserviceURL + 'webservices/getVanPosition.php?vanid=' + myService.vanDetail.van_id)
      .then(function(response) {
        $scope.vanPosition = response.data.results[0];
        callback();
      });
  }

  function getVanMemberDetail(callback) {
    $http.get(myService.configAPI.webserviceURL + 'webservices/getVanMemberDetail.php?memberid=' + $scope.vanPosition.van_member_id)
      .then(function(response) {
        $scope.vanMemberDetail = response.data.results[0];
        console.log($scope.vanMemberDetail);
        callback();
      });
  }

  $scope.initMap = function() {
    getVanPosition(function(status) {
      googleMap();
    });
  };

  $ionicPlatform.ready(function() {
    $scope.initMap();
    $scope.updatePosition = setInterval(function() {
      getVanPosition2(function(status) {
        updateVanMarker();
      });
    }, 60000);
  });

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
      if ($state.current.name == 'notlogin.map') {
        if (jQuery('[id^=dialog]').length == 0) {
          $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            targetEvent: null,
            locals: {
              displayOption: {
                title: "การยืนยัน",
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
