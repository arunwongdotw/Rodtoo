appControllers.controller('ownPaymentListCtrl', function($scope, $timeout, $state, $ionicHistory, $mdDialog, $http, myService, $mdSidenav, $ionicPlatform) {

  $http.get(myService.configAPI.webserviceURL + 'webservices/getOwnPaymentList.php?memberid=' + myService.memberDetailFromLogin.member_id)
    .then(function(response) {
      $scope.ownPaymentArrayList = response.data.results;
    }, function(error) {
      $mdDialog.show({
        controller: 'DialogController',
        templateUrl: 'confirm-dialog.html',
        locals: {
          displayOption: {
            title: "เกิดข้อผิดพลาด !",
            content: "เกิดข้อผิดพลาด getOwnPaymentList ใน ownPaymentListController ระบบจะปิดอัตโนมัติ",
            ok: "ตกลง"
          }
        }
      }).then(function(response) {
        ionic.Platform.exitApp();
      });
    });

  $scope.getInfomation = function(booking_id) {
    myService.bookingIDInList.booking_id = booking_id;
    $state.go('loginown.ownpaymentdetail');
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
      if ($state.current.name == 'loginown.ownpaymentlist') {
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
