appControllers.controller('ownPaymentDetailCtrl', function($scope, $timeout, $state, $ionicHistory, $mdDialog, $http, myService, $mdSidenav, $cordovaInAppBrowser) {

  $http.get(myService.configAPI.webserviceURL + 'webservices/getPaymentDetail.php?bookingid=' + myService.bookingIDInList.booking_id)
    .then(function(response) {
      $scope.paymentDetail = response.data.results[0];
      getOriginProvince($scope.paymentDetail.booking_origin_province_id);
      getOriginDistrict($scope.paymentDetail.booking_origin_district_id);
      getDestinationProvince($scope.paymentDetail.booking_destination_province_id);
      getDestinationDistrict($scope.paymentDetail.booking_destination_district_id);
      if ($scope.paymentDetail.booking_getin_id != "-") {
        getGetInDetail($scope.paymentDetail.booking_getin_id);
      }
    }, function(error) {
      $mdDialog.show({
        controller: 'DialogController',
        templateUrl: 'confirm-dialog.html',
        locals: {
          displayOption: {
            title: "เกิดข้อผิดพลาด !",
            content: "เกิดข้อผิดพลาด getPaymentDetail ใน ownPaymentDetailController ระบบจะปิดอัตโนมัติ",
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
    $scope.navigateTo('loginown.ownpaymentlist');
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
              content: "เกิดข้อผิดพลาด getOriginProvince ใน ownPaymentDetailController ระบบจะปิดอัตโนมัติ",
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
              content: "เกิดข้อผิดพลาด getOriginDistrict ใน ownPaymentDetailController ระบบจะปิดอัตโนมัติ",
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
              content: "เกิดข้อผิดพลาด getDestinationProvince ใน ownPaymentDetailController ระบบจะปิดอัตโนมัติ",
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
              content: "เกิดข้อผิดพลาด getDestinationDistrict ใน ownPaymentDetailController ระบบจะปิดอัตโนมัติ",
              ok: "ตกลง"
            }
          }
        }).then(function(response) {
          ionic.Platform.exitApp();
        });
      });
  }

  function getQueueOwner(queue_member_id) {
    $http.get(myService.configAPI.webserviceURL + 'webservices/getQueueOwner.php?memberid=' + queue_member_id)
      .then(function(response) {
        $scope.ownerDetail = response.data.results[0];
      }, function(error) {
        $mdDialog.show({
          controller: 'DialogController',
          templateUrl: 'confirm-dialog.html',
          locals: {
            displayOption: {
              title: "เกิดข้อผิดพลาด !",
              content: "เกิดข้อผิดพลาด getQueueOwner ใน ownPaymentDetailController ระบบจะปิดอัตโนมัติ",
              ok: "ตกลง"
            }
          }
        }).then(function(response) {
          ionic.Platform.exitApp();
        });
      });
  }

  $scope.openLink = function(payment_img) {
    var options = {
      location: 'yes',
      clearcache: 'yes',
      toolbar: 'no'
    };
    $cordovaInAppBrowser.open('http://1did.net/rodtoo/img/img_slip/' + payment_img, '_system', options);
  };

  $scope.btnConfirmPayment = function(booking_id) {
    $mdDialog.show({
      controller: 'DialogController',
      templateUrl: 'confirm-dialog.html',
      locals: {
        displayOption: {
          title: "ยืนยันการชำระเงิน ?",
          content: "คุณแน่ใจที่จะยืนยันการชำระเงินรายการนี้",
          ok: "ตกลง",
          cancel: "ยกเลิก"
        }
      }
    }).then(function(response) {
      $http({
        url: myService.configAPI.webserviceURL + 'webservices/updateBookingStatus.php',
        method: 'POST',
        data: {
          var_bookingid: booking_id,
        }
      }).then(function(response) {
        $mdDialog.show({
          controller: 'DialogController',
          templateUrl: 'confirm-dialog.html',
          locals: {
            displayOption: {
              title: "ยืนยันการชำระเงินรายการนี้สำเร็จ !",
              content: "คุณยืนยันการชำระเงินรายการนี้สำเร็จ",
              ok: "ตกลง"
            }
          }
        }).then(function(response) {
          $state.go('loginown.ownpaymentlist');
        });
      }, function(error) {
        $mdDialog.show({
          controller: 'DialogController',
          templateUrl: 'confirm-dialog.html',
          locals: {
            displayOption: {
              title: "เกิดข้อผิดพลาด !",
              content: "เกิดข้อผิดพลาด btnConfirmPayment ใน ownPaymentDetailController ระบบจะปิดอัตโนมัติ",
              ok: "ตกลง"
            }
          }
        }).then(function(response) {
          ionic.Platform.exitApp();
        });
      });
    });
  };

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
              content: "เกิดข้อผิดพลาด getGetInDetail ใน cusBookingDetailController ระบบจะปิดอัตโนมัติ",
              ok: "ตกลง"
            }
          }
        }).then(function(response) {
          ionic.Platform.exitApp();
        });
      });
  }
});
