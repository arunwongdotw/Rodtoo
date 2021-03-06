appControllers.controller('addPointCtrl', function($scope, $timeout, $state, $stateParams, $ionicHistory, $http, myService, $mdDialog) {
  $scope.point = {};

  $scope.btnAddPoint = function() {
    var checkNumberRegEx = /^[0-9]+$/;
    if (($scope.point.name != null) && ($scope.point.name != "")) {
      if (($scope.point.price != null) && ($scope.point.price != "")) {
        if (checkNumberRegEx.test($scope.point.price)) {
          // if (($scope.point.fee != null) && ($scope.point.fee != "")) {
          //   if (checkNumberRegEx.test($scope.point.fee)) {
              $mdDialog.show({
                controller: 'DialogController',
                templateUrl: 'confirm-dialog.html',
                locals: {
                  displayOption: {
                    title: "เพิ่มจุดลงรถตู้ ?",
                    content: "คุณแน่ใจที่จะเพิ่มจุดลงรถตู้",
                    ok: "ตกลง",
                    cancel: "ยกเลิก"
                  }
                }
              }).then(function(response) {
                $http({
                  url: myService.configAPI.webserviceURL + 'webservices/addPoint.php',
                  method: 'POST',
                  data: {
                    var_memberid: myService.memberDetailFromLogin.member_id,
                    var_name: $scope.point.name,
                    var_price: $scope.point.price,
                    var_fee: $scope.point.fee
                  }
                }).then(function(response) {
                  $mdDialog.show({
                    controller: 'DialogController',
                    templateUrl: 'confirm-dialog.html',
                    locals: {
                      displayOption: {
                        title: "เพิ่มจุดลงรถตู้สำเร็จ !",
                        content: "คุณเพิ่มจุดลงรถตู้สำเร็จ",
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
                        content: "เกิดข้อผิดพลาด btnAddPoint ใน addPointController ระบบจะปิดอัตโนมัติ",
                        ok: "ตกลง"
                      }
                    }
                  }).then(function(response) {
                    ionic.Platform.exitApp();
                  });
                });
              });
          //   } else {
          //     $mdDialog.show({
          //       controller: 'DialogController',
          //       templateUrl: 'confirm-dialog.html',
          //       locals: {
          //         displayOption: {
          //           title: "ราคาค่านำเนียมไม่ถูกต้อง !",
          //           content: "ราคาค่าทำเนียม ต้องเป็นตัวเลขเท่านั้น",
          //           ok: "ตกลง"
          //         }
          //       }
          //     });
          //   }
          // } else {
          //   $mdDialog.show({
          //     controller: 'DialogController',
          //     templateUrl: 'confirm-dialog.html',
          //     locals: {
          //       displayOption: {
          //         title: "ราคาค่านำเนียมไม่ถูกต้อง !",
          //         content: "กรุณากรอกราคาค่าทำเนียม",
          //         ok: "ตกลง"
          //       }
          //     }
          //   });
          // }
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
