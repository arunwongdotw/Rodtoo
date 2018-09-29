appControllers.controller('ownBookingDetailCtrl', function($scope, $timeout, $state, $ionicHistory, $mdDialog, $http, myService, $mdSidenav, $cordovaInAppBrowser) {
  
  $http.get(myService.configAPI.webserviceURL + 'webservices/getOwnBookingDetail.php?bookingid=' + myService.bookingIDInList.booking_id)
    .then(function(response) {
      $scope.bookingDetail = response.data.results[0];
      getOriginProvince($scope.bookingDetail.queue_origin_province_id);
      getOriginDistrict($scope.bookingDetail.queue_origin_district_id);
      getDestinationProvince($scope.bookingDetail.queue_destination_province_id);
      getDestinationDistrict($scope.bookingDetail.queue_destination_district_id);
      if ($scope.bookingDetail.booking_van_id != 0) {
        getVanDetail($scope.bookingDetail.booking_van_id);
      }
    }, function(error) {
      $mdDialog.show({
        controller: 'DialogController',
        templateUrl: 'confirm-dialog.html',
        locals: {
          displayOption: {
            title: "เกิดข้อผิดพลาด !",
            content: "เกิดข้อผิดพลาด getOwnBookingDetail ใน ownBookingDetailController ระบบจะปิดอัตโนมัติ",
            ok: "ตกลง"
          }
        }
      }).then(function(response) {
        ionic.Platform.exitApp();
      });
    });

  $scope.navigateTo = function(stateName) {
    $timeout(function() {
      $mdSidenav('left').close();
      if ($ionicHistory.currentStateName() != stateName) {
        $ionicHistory.nextViewOptions({
          disableAnimate: true,
          disableBack: true
        });
        $state.go(stateName);
      }
    }, ($scope.isAndroid == false ? 300 : 0));
  };

  $scope.btnBack = function() {
    $scope.navigateTo('loginown.ownbookinglist');
  };

  function getOriginProvince(origin_province_id) {
    $http.get(myService.configAPI.webserviceURL + 'webservices/getOriginProvinceDetail.php?provinceid=' + origin_province_id)
      .then(function(response) {
        $scope.originProvince = response.data.results[0];
      }, function(error) {
        $mdDialog.show({
          controller: 'DialogController',
          templateUrl: 'confirm-dialog.html',
          locals: {
            displayOption: {
              title: "เกิดข้อผิดพลาด !",
              content: "เกิดข้อผิดพลาด getOriginProvince ใน ownBookingDetailController ระบบจะปิดอัตโนมัติ",
              ok: "ตกลง"
            }
          }
        }).then(function(response) {
          ionic.Platform.exitApp();
        });
      });
  }

  function getOriginDistrict(origin_district_id) {
    $http.get(myService.configAPI.webserviceURL + 'webservices/getOriginDistrictDetail.php?districtid=' + origin_district_id)
      .then(function(response) {
        $scope.originDistrict = response.data.results[0];
      }, function(error) {
        $mdDialog.show({
          controller: 'DialogController',
          templateUrl: 'confirm-dialog.html',
          locals: {
            displayOption: {
              title: "เกิดข้อผิดพลาด !",
              content: "เกิดข้อผิดพลาด getOriginDistrict ใน ownBookingDetailController ระบบจะปิดอัตโนมัติ",
              ok: "ตกลง"
            }
          }
        }).then(function(response) {
          ionic.Platform.exitApp();
        });
      });
  }

  function getDestinationProvince(destination_province_id) {
    $http.get(myService.configAPI.webserviceURL + 'webservices/getDestinationProvinceDetail.php?provinceid=' + destination_province_id)
      .then(function(response) {
        $scope.destinationProvince = response.data.results[0];
      }, function(error) {
        $mdDialog.show({
          controller: 'DialogController',
          templateUrl: 'confirm-dialog.html',
          locals: {
            displayOption: {
              title: "เกิดข้อผิดพลาด !",
              content: "เกิดข้อผิดพลาด getDestinationProvince ใน ownBookingDetailController ระบบจะปิดอัตโนมัติ",
              ok: "ตกลง"
            }
          }
        }).then(function(response) {
          ionic.Platform.exitApp();
        });
      });
  }

  function getDestinationDistrict(destination_district_id) {
    $http.get(myService.configAPI.webserviceURL + 'webservices/getDestinationDistrictDetail.php?districtid=' + destination_district_id)
      .then(function(response) {
        $scope.destinationDistrict = response.data.results[0];
      }, function(error) {
        $mdDialog.show({
          controller: 'DialogController',
          templateUrl: 'confirm-dialog.html',
          locals: {
            displayOption: {
              title: "เกิดข้อผิดพลาด !",
              content: "เกิดข้อผิดพลาด getDestinationDistrict ใน ownBookingDetailController ระบบจะปิดอัตโนมัติ",
              ok: "ตกลง"
            }
          }
        }).then(function(response) {
          ionic.Platform.exitApp();
        });
      });
  }

  function getVanDetail(van_id) {
    $http.get(myService.configAPI.webserviceURL + 'webservices/getVanDetail.php?vanid=' + van_id)
      .then(function(response) {
        $scope.vanDetail = response.data.results[0];
      }, function(error) {
        $mdDialog.show({
          controller: 'DialogController',
          templateUrl: 'confirm-dialog.html',
          locals: {
            displayOption: {
              title: "เกิดข้อผิดพลาด !",
              content: "เกิดข้อผิดพลาด getVanDetail ใน ownBookingDetailController ระบบจะปิดอัตโนมัติ",
              ok: "ตกลง"
            }
          }
        }).then(function(response) {
          ionic.Platform.exitApp();
        });
      });
  }
});
