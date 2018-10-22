appControllers.controller('cusBookingListCtrl', function($scope, $timeout, $state, $ionicHistory, $mdDialog, $http, myService, $mdSidenav, $ionicNavBarDelegate) {

  $scope.$on('$ionicView.enter', function(e) {
    $ionicNavBarDelegate.showBar(true);
  });

  $http.get(myService.configAPI.webserviceURL + 'webservices/getBookingList.php?memberid=' + myService.memberDetailFromLogin.member_id)
    .then(function(response) {
      $scope.bookingListArrayList = response.data.results;
    }, function(error) {
      $mdDialog.show({
        controller: 'DialogController',
        templateUrl: 'confirm-dialog.html',
        locals: {
          displayOption: {
            title: "เกิดข้อผิดพลาด !",
            content: "เกิดข้อผิดพลาด getBookingList ใน cusBookingListController ระบบจะปิดอัตโนมัติ",
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

  $scope.getInfomation = function(booking_id) {
    myService.bookingIDInList.booking_id = booking_id;
    $state.go('logincus.cusbookingdetail');
  };

  $scope.getPayment = function(booking_id) {
    myService.bookingIDInList.booking_id = booking_id;
    $state.go('logincus.payment');
  };

  $scope.getMap = function(van_id) {
    $http({
      url: myService.configAPI.webserviceURL + 'webservices/checkVanStatus.php',
      method: 'POST',
      data: {
        var_vanid: van_id
      }
    }).then(function(response) {
      if ((response.data.results == "checkVanStatus_isZero") || (response.data.results == "checkVanStatus_isOne")) {
        $mdDialog.show({
          controller: 'DialogController',
          templateUrl: 'confirm-dialog.html',
          locals: {
            displayOption: {
              title: "รถตู้ยังไม่ออกเดินทาง !",
              content: "รถตู้ที่คุณติดตาม ยังไม่ออกเดินทาง กรุณาลองใหม่ภายหลัง",
              ok: "ตกลง"
            }
          }
        });
      } else {
        myService.vanDetail.van_id = van_id;
        $state.go('logincus.cusmap');
      }
    }, function(error) {
      $mdDialog.show({
        controller: 'DialogController',
        templateUrl: 'confirm-dialog.html',
        locals: {
          displayOption: {
            title: "เกิดข้อผิดพลาด !",
            content: "เกิดข้อผิดพลาด getMap ใน cusMapController ระบบจะปิดอัตโนมัติ",
            ok: "ตกลง"
          }
        }
      }).then(function(response) {
        ionic.Platform.exitApp();
      });
    });
  };

  $scope.delBooking = function(booking_id) {
    $mdDialog.show({
      controller: 'DialogController',
      templateUrl: 'confirm-dialog.html',
      locals: {
        displayOption: {
          title: "ยกเลิกการจองรถตู้ ?",
          content: "คุณแน่ใจที่จะยกเลิกการจองรถตู้ครั้งนี้",
          ok: "ตกลง",
          cancel: "ยกเลิก"
        }
      }
    }).then(function(response) {
      $http({
        url: myService.configAPI.webserviceURL + 'webservices/delBooking.php',
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
              title: "ยกเลิกการจองรถตู้สำเร็จ !",
              content: "คุณยกเลิกการจองรถตู้สำเร็จ",
              ok: "ตกลง"
            }
          }
        }).then(function(response) {
          $state.reload();
        });
      }, function(error) {
        $mdDialog.show({
          controller: 'DialogController',
          templateUrl: 'confirm-dialog.html',
          locals: {
            displayOption: {
              title: "เกิดข้อผิดพลาด !",
              content: "เกิดข้อผิดพลาด delBooking ใน cusBookingListController ระบบจะปิดอัตโนมัติ",
              ok: "ตกลง"
            }
          }
        }).then(function(response) {
          ionic.Platform.exitApp();
        });
      });
    });
  };
});
