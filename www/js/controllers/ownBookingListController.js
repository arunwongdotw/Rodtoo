appControllers.controller('ownBookingListCtrl', function($scope, $timeout, $state, $ionicHistory, $mdDialog, $http, myService, $mdSidenav, $ionicPlatform, $ionicNavBarDelegate) {

  $scope.$on('$ionicView.enter', function(e) {
    $ionicNavBarDelegate.showBar(true);
  });

  $http.get(myService.configAPI.webserviceURL + 'webservices/getOwnBookingList.php?memberid=' + myService.memberDetailFromLogin.member_id)
    .then(function(response) {
      $scope.ownBookingArrayList = response.data.results;
    });

  $scope.getInfomation = function(booking_id) {
    myService.bookingIDInList.booking_id = booking_id;
    $state.go('loginown.ownbookingdetail');
  };

  $scope.assignVan = function(booking_id) {
    myService.bookingIDInList.booking_id = booking_id;
    $state.go('loginown.ownvanselect');
  };

  $scope.cancel = function(booking_id) {
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
        url: myService.configAPI.webserviceURL + 'webservices/cancelBooking.php',
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
              content: "เกิดข้อผิดพลาด cancel ใน ownBookingListController ระบบจะปิดอัตโนมัติ",
              ok: "ตกลง"
            }
          }
        }).then(function(response) {
          ionic.Platform.exitApp();
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
      if ($state.current.name == 'loginown.ownbookinglist') {
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
