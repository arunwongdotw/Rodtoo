appControllers.controller('addGetInCtrl', function($scope, $timeout, $state, $stateParams, $ionicHistory, $http, myService, $mdDialog) {
  $scope.getin = {};

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

  $scope.btnAddGetIn = function() {
    if (($scope.getin.name != null) && ($scope.getin.name != "")) {
      $mdDialog.show({
        controller: 'DialogController',
        templateUrl: 'confirm-dialog.html',
        locals: {
          displayOption: {
            title: "เพิ่มจุดขึ้นรถตู้ ?",
            content: "คุณแน่ใจที่จะเพิ่มจุดขึ้นรถตู้",
            ok: "ตกลง",
            cancel: "ยกเลิก"
          }
        }
      }).then(function(response) {
        $http({
          url: myService.configAPI.webserviceURL + 'webservices/addGetIn.php',
          method: 'POST',
          data: {
            var_memberid: myService.memberDetailFromLogin.member_id,
            var_name: $scope.getin.name
          }
        }).then(function(response) {
          $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            locals: {
              displayOption: {
                title: "เพิ่มจุดขึ้นรถตู้สำเร็จ !",
                content: "คุณเพิ่มจุดขึ้นรถตู้สำเร็จ",
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
                content: "เกิดข้อผิดพลาด btnAddGetIn ใน addGetInController ระบบจะปิดอัตโนมัติ",
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
