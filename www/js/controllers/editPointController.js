appControllers.controller('editPointCtrl', function($scope, $timeout, $state, $stateParams, $ionicHistory, $http, myService, $mdDialog) {
  $scope.point = {};

  $http.get(myService.configAPI.webserviceURL + 'webservices/getEditPoint.php?pointid=' + myService.editPoint.point_id)
    .then(function(response) {
      $scope.point.name = response.data.results[0].point_name;
      $scope.point.price = response.data.results[0].point_price;
    }, function(error) {
      $mdDialog.show({
        controller: 'DialogController',
        templateUrl: 'confirm-dialog.html',
        locals: {
          displayOption: {
            title: "เกิดข้อผิดพลาด !",
            content: "เกิดข้อผิดพลาด getEditPoint ใน editPointController ระบบจะปิดอัตโนมัติ",
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
    $scope.navigateTo('loginown.ownpointlist');
  };

  $scope.btnEditPoint = function() {
    var checkNumberRegEx = /^[0-9]+$/;
    if (($scope.point.name != null) && ($scope.point.name != "")) {
      if (($scope.point.price != null) && ($scope.point.price != "")) {
        if (checkNumberRegEx.test($scope.point.price)) {
          $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            locals: {
              displayOption: {
                title: "แก้ไขจุดลงรถตู้ ?",
                content: "คุณแน่ใจที่จะแก้ไขจุดลงรถตู้",
                ok: "ตกลง",
                cancel: "ยกเลิก"
              }
            }
          }).then(function(response) {
            $http({
              url: myService.configAPI.webserviceURL + 'webservices/editPoint.php',
              method: 'POST',
              data: {
                var_pointid: myService.editPoint.point_id,
                var_name: $scope.point.name,
                var_price: $scope.point.price
              }
            }).then(function(response) {
              $mdDialog.show({
                controller: 'DialogController',
                templateUrl: 'confirm-dialog.html',
                locals: {
                  displayOption: {
                    title: "แก้ไขจุดลงรถตู้สำเร็จ !",
                    content: "คุณแก้ไขจุดลงรถตู้สำเร็จ",
                    ok: "ตกลง"
                  }
                }
              }).then(function(response) {
                $state.go('loginown.ownpointlist');
              });
            }, function(error) {
              $mdDialog.show({
                controller: 'DialogController',
                templateUrl: 'confirm-dialog.html',
                locals: {
                  displayOption: {
                    title: "เกิดข้อผิดพลาด !",
                    content: "เกิดข้อผิดพลาด btnEditPoint ใน editPointController ระบบจะปิดอัตโนมัติ",
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
                title: "ราคาค่าบริการไม่ถูกต้อง !",
                content: "ราคาค่าบริการ ต้องเป็นตัวเลขเท่านั้น",
                ok: "ตกลง"
              }
            }
          });
        }
      } else {
        $mdDialog.show({
          controller: 'DialogController',
          templateUrl: 'confirm-dialog.html',
          locals: {
            displayOption: {
              title: "ราคาค่าบริการไม่ถูกต้อง !",
              content: "กรุณากรอกราคาค่าบริการ",
              ok: "ตกลง"
            }
          }
        });
      }
    } else {
      $mdDialog.show({
        controller: 'DialogController',
        templateUrl: 'confirm-dialog.html',
        locals: {
          displayOption: {
            title: "ชื่อจุดลงรถตู้ไม่ถูกต้อง !",
            content: "กรุณากรอกชื่อจุดลงรถตู้",
            ok: "ตกลง"
          }
        }
      });
    }
  };
});
