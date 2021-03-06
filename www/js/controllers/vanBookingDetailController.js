appControllers.controller('vanBookingDetailCtrl', function($scope, $timeout, $state, $ionicHistory, $mdDialog, $http, myService, $mdSidenav) {

  $http.get(myService.configAPI.webserviceURL + 'webservices/getOwnBookingDetail.php?bookingid=' + myService.bookingIDInList.booking_id)
    .then(function(response) {
      $scope.bookingDetail = response.data.results[0];
      getOriginProvince($scope.bookingDetail.booking_origin_province_id);
      getOriginDistrict($scope.bookingDetail.booking_origin_district_id);
      getDestinationProvince($scope.bookingDetail.booking_destination_province_id);
      getDestinationDistrict($scope.bookingDetail.booking_destination_district_id);
      if ($scope.bookingDetail.booking_van_id != 0) {
        getVanDetail($scope.bookingDetail.booking_van_id);
      }
      if ($scope.bookingDetail.booking_getin_id != "-") {
        getGetInDetail($scope.bookingDetail.booking_getin_id);
      }
    }, function(error) {
      $mdDialog.show({
        controller: 'DialogController',
        templateUrl: 'confirm-dialog.html',
        locals: {
          displayOption: {
            title: "เกิดข้อผิดพลาด !",
            content: "เกิดข้อผิดพลาด getOwnBookingDetail ใน vanBookingDetailController ระบบจะปิดอัตโนมัติ",
            ok: "ตกลง"
          }
        }
      }).then(function(response) {
        ionic.Platform.exitApp();
      });
    });

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
              content: "เกิดข้อผิดพลาด getOriginProvince ใน vanBookingDetailController ระบบจะปิดอัตโนมัติ",
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
              content: "เกิดข้อผิดพลาด getOriginDistrict ใน vanBookingDetailController ระบบจะปิดอัตโนมัติ",
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
              content: "เกิดข้อผิดพลาด getDestinationProvince ใน vanBookingDetailController ระบบจะปิดอัตโนมัติ",
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
              content: "เกิดข้อผิดพลาด getDestinationDistrict ใน vanBookingDetailController ระบบจะปิดอัตโนมัติ",
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
              content: "เกิดข้อผิดพลาด getVanDetail ใน vanBookingDetailController ระบบจะปิดอัตโนมัติ",
              ok: "ตกลง"
            }
          }
        }).then(function(response) {
          ionic.Platform.exitApp();
        });
      });
  }

  function getGetInDetail(booking_getin_id) {
    $http.get(myService.configAPI.webserviceURL + 'webservices/getGetInDetail.php?getinid=' + booking_getin_id)
      .then(function(response) {
        $scope.getInDetail = response.data.results[0];
      }, function(error) {
        $mdDialog.show({
          controller: 'DialogController',
          templateUrl: 'confirm-dialog.html',
          locals: {
            displayOption: {
              title: "เกิดข้อผิดพลาด !",
              content: "เกิดข้อผิดพลาด getGetInDetail ใน vanBookingDetailController ระบบจะปิดอัตโนมัติ",
              ok: "ตกลง"
            }
          }
        }).then(function(response) {
          ionic.Platform.exitApp();
        });
      });
  }
});
