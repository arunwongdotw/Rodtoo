appControllers.controller('ownVanSelectCtrl', function($scope, $timeout, $state, $ionicHistory, $mdDialog, $http, myService, $mdSidenav) {

  $http.get(myService.configAPI.webserviceURL + 'webservices/getOwnVanList2.php?memberid=' + myService.memberDetailFromLogin.member_id)
    .then(function(response) {
      $scope.ownVanArrayList = response.data.results;
    }, function(error) {
      $mdDialog.show({
        controller: 'DialogController',
        templateUrl: 'confirm-dialog.html',
        locals: {
          displayOption: {
            title: "เกิดข้อผิดพลาด !",
            content: "เกิดข้อผิดพลาด getOwnVanList ใน ownVanSelectController ระบบจะปิดอัตโนมัติ",
            ok: "ตกลง"
          }
        }
      }).then(function(response) {
        ionic.Platform.exitApp();
      });
    });

  $scope.assignVan = function(van_id) {
    $mdDialog.show({
      controller: 'DialogController',
      templateUrl: 'confirm-dialog.html',
      locals: {
        displayOption: {
          title: "เลือกรถตู้ ?",
          content: "คุณแน่ใจที่จะเลือกรถตู้คันนี้ให้กับการจองรายการนี้",
          ok: "ตกลง",
          cancel: "ยกเลิก"
        }
      }
    }).then(function(response) {
      $http({
        url: myService.configAPI.webserviceURL + 'webservices/assignVan.php',
        method: 'POST',
        data: {
          var_bookingid: myService.bookingIDInList.booking_id,
          var_vanid: van_id
        }
      }).then(function(response) {
        $mdDialog.show({
          controller: 'DialogController',
          templateUrl: 'confirm-dialog.html',
          locals: {
            displayOption: {
              title: "เลือกรถตู้สำเร็จ !",
              content: "คุณเลือกรถตู้สำเร็จ",
              ok: "ตกลง"
            }
          }
        }).then(function(response) {
          $http.get(myService.configAPI.webserviceURL + 'php_push/vanSelectNotification.php?bookingid=' + myService.bookingIDInList.booking_id);
          $state.go('loginown.ownbookinglist');
        });
      }, function(error) {
        $mdDialog.show({
          controller: 'DialogController',
          templateUrl: 'confirm-dialog.html',
          locals: {
            displayOption: {
              title: "เกิดข้อผิดพลาด !",
              content: "เกิดข้อผิดพลาด assignVan ใน ownVanSelectController ระบบจะปิดอัตโนมัติ",
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
