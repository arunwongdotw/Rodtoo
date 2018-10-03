appControllers.controller('editGetInCtrl', function($scope, $timeout, $state, $stateParams, $ionicHistory, $http, myService, $mdDialog, $cordovaFileTransfer, $cordovaCamera) {
  $scope.getin = {};

  $http.get(myService.configAPI.webserviceURL + 'webservices/getEditGetIn.php?getinid=' + myService.editGetIn.getin_id)
    .then(function(response) {
      $scope.getin.name = response.data.results[0].getin_name;
    }, function(error) {
      $mdDialog.show({
        controller: 'DialogController',
        templateUrl: 'confirm-dialog.html',
        locals: {
          displayOption: {
            title: "เกิดข้อผิดพลาด !",
            content: "เกิดข้อผิดพลาด getEditGetIn ใน editGetInController ระบบจะปิดอัตโนมัติ",
            ok: "ตกลง"
          }
        }
      }).then(function(response) {
        ionic.Platform.exitApp();
      });
    });

  $scope.navigateTo = function(stateName) {
    $timeout(function() {
      if ($ionicHistory.currentStateName() != stateName) {
        $ionicHistory.nextViewOptions({
          disableAnimate: false,
          disableBack: true
        });
        $state.go(stateName);
      }
    }, ($scope.isAnimated ? 300 : 0));
  };

  $scope.btnBack = function() {
    $scope.navigateTo('loginown.owngetinlist');
  };

  $scope.btnEditGetIn = function() {
    if (($scope.getin.name != null) && ($scope.getin.name != "")) {
      $mdDialog.show({
        controller: 'DialogController',
        templateUrl: 'confirm-dialog.html',
        locals: {
          displayOption: {
            title: "แก้ไขจุดขึ้นรถตู้ ?",
            content: "คุณแน่ใจที่จะแก้ไขจุดขึ้นรถตู้",
            ok: "ตกลง",
            cancel: "ยกเลิก"
          }
        }
      }).then(function(response) {
        $http({
          url: myService.configAPI.webserviceURL + 'webservices/editGetIn.php',
          method: 'POST',
          data: {
            var_getinid: myService.editGetIn.getin_id,
            var_name: $scope.getin.name
          }
        }).then(function(response) {
          $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            locals: {
              displayOption: {
                title: "แก้ไขจุดขึ้นรถตู้สำเร็จ !",
                content: "คุณแก้ไขจุดขึ้นรถตู้สำเร็จ",
                ok: "ตกลง"
              }
            }
          }).then(function(response) {
            $state.go('loginown.owngetinlist');
          });
        }, function(error) {
          $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            locals: {
              displayOption: {
                title: "เกิดข้อผิดพลาด !",
                content: "เกิดข้อผิดพลาด btnEditGetIn ใน editGetInController ระบบจะปิดอัตโนมัติ",
                ok: "ตกลง"
              }
            }
          }).then(function(response) {
            ionic.Platform.exitApp();
          });
        });
      });
    } else {
      $mdDialog.show({
        controller: 'DialogController',
        templateUrl: 'confirm-dialog.html',
        locals: {
          displayOption: {
            title: "ชื่อจุดขึ้นรถตู้ไม่ถูกต้อง !",
            content: "กรุณากรอกชื่อจุดขึ้นรถตู้",
            ok: "ตกลง"
          }
        }
      });
    }
  };
});
