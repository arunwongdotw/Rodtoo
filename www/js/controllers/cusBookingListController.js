appControllers.controller('cusBookingListCtrl', function($scope, $timeout, $state, $ionicHistory, $mdDialog, $http, myService, $mdSidenav, $ionicNavBarDelegate, $ionicPlatform) {
  var iloop = 0;
  var currentDateTime = new Date();

  $scope.$on('$ionicView.enter', function(e) {
    $ionicNavBarDelegate.showBar(true);
  });

  $http.get(myService.configAPI.webserviceURL + 'webservices/getBookingList.php?memberid=' + myService.memberDetailFromLogin.member_id)
    .then(function(response) {
      $scope.bookingListArrayList = response.data.results;
      addHoursDiff(function(status) {});
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

  function addHoursDiff(callback) {
    if (iloop < $scope.bookingListArrayList.length) {
      var dateTimeString = $scope.bookingListArrayList[iloop].booking_boarding_date  + " " + $scope.bookingListArrayList[iloop].booking_boarding_time;
      var bookingDateTime = new Date(dateTimeString);
      var timeDiff = Math.abs(bookingDateTime.getTime() - currentDateTime.getTime());
      var hoursDiff = timeDiff / 3600000;
      $scope.bookingListArrayList[iloop].booking_hours_diff = hoursDiff;
      iloop = iloop + 1;
      addHoursDiff(callback);
    } else {
      callback();
    }
  }

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

  $scope.getPostpone = function(booking_id) {
    myService.bookingIDInList.booking_id = booking_id;
    $state.go('logincus.postpone');
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
      if ($state.current.name == 'logincus.cusbookinglist') {
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
        $ionicHistory.goBack();
      }
    }
  }, 100);
});
