appControllers.controller('addPromotionCtrl', function($scope, $timeout, $state, $stateParams, $ionicHistory, $http, myService, $mdDialog) {
  $scope.promotion = {};

  $scope.btnAddPromotion = function() {
    var checkNumberRegEx = /^[0-9]+$/;
    if (($scope.promotion.detail != null) && ($scope.promotion.detail != "")) {
      if (($scope.promotion.detail != null) && ($scope.promotion.detail != "")) {
        if (($scope.promotion.freq != null) && ($scope.promotion.freq != "")) {
          if (checkNumberRegEx.test($scope.promotion.freq)) {
            $mdDialog.show({
              controller: 'DialogController',
              templateUrl: 'confirm-dialog.html',
              locals: {
                displayOption: {
                  title: "เพิ่มโปรโมชัน ?",
                  content: "คุณแน่ใจที่จะเพิ่มโปรโมชัน",
                  ok: "ตกลง",
                  cancel: "ยกเลิก"
                }
              }
            }).then(function(response) {
              $http({
                url: myService.configAPI.webserviceURL + 'webservices/insertPromotion.php',
                method: 'POST',
                data: {
                  var_memberid: myService.memberDetailFromLogin.member_id,
                  var_name: $scope.promotion.name,
                  var_detail: $scope.promotion.detail,
                  var_freq: $scope.promotion.freq
                }
              }).then(function(response) {
                $mdDialog.show({
                  controller: 'DialogController',
                  templateUrl: 'confirm-dialog.html',
                  locals: {
                    displayOption: {
                      title: "เพิ่มโปรโมชันสำเร็จ !",
                      content: "คุณเพิ่มโปรโมชันสำเร็จ",
                      ok: "ตกลง"
                    }
                  }
                }).then(function(response) {
                  $state.go('loginown.ownpromotionlist');
                });
              }, function(error) {
                $mdDialog.show({
                  controller: 'DialogController',
                  templateUrl: 'confirm-dialog.html',
                  locals: {
                    displayOption: {
                      title: "เกิดข้อผิดพลาด !",
                      content: "เกิดข้อผิดพลาด btnAddPromotion ใน addPromotionController ระบบจะปิดอัตโนมัติ",
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
                  title: "จำนวนครั้งที่ใช้แลกโปรโมชันไม่ถูกต้อง !",
                  content: "จำนวนครั้งที่ใช้แลกโปรโมชัน ต้องเป็นตัวเลขเท่านั้น",
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
                title: "จำนวนครั้งที่ใช้แลกโปรโมชันไม่ถูกต้อง !",
                content: "กรุณากรอกจำนวนครั้งที่ใช้แลกโปรโมชัน",
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
              title: "รายละเอียดโปรโมชันไม่ถูกต้อง !",
              content: "กรุณากรอกรายละเอียดโปรโมชัน",
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
            title: "ชื่อโปรโมชันไม่ถูกต้อง !",
            content: "กรุณากรอกชื่อโปรโมชัน",
            ok: "ตกลง"
          }
        }
      });
    }
  };
});
