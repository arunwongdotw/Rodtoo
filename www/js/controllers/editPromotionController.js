appControllers.controller('editPromotionCtrl', function($scope, $timeout, $state, $stateParams, $ionicHistory, $http, myService, $mdDialog) {
  $scope.promotion = {};

  $http.get(myService.configAPI.webserviceURL + 'webservices/getPromotionDetail.php?promotionid=' + myService.editPromotion.promotion_id)
    .then(function(response) {
      console.log(response);
      $scope.promotion.id = response.data.results[0].promotion_id;
      $scope.promotion.name = response.data.results[0].promotion_name;
      $scope.promotion.detail = response.data.results[0].promotion_detail;
      $scope.promotion.freq = response.data.results[0].promotion_freq;
    }, function(error) {
      $mdDialog.show({
        controller: 'DialogController',
        templateUrl: 'confirm-dialog.html',
        locals: {
          displayOption: {
            title: "เกิดข้อผิดพลาด !",
            content: "เกิดข้อผิดพลาด getPromotionDetail ใน editPromotionController ระบบจะปิดอัตโนมัติ",
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
    $scope.navigateTo('loginown.ownpromotionlist');
  };

  $scope.btnEditPromotion = function() {
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
                  title: "แก้ไขโปรโมชัน ?",
                  content: "คุณแน่ใจที่จะแก้ไขโปรโมชัน",
                  ok: "ตกลง",
                  cancel: "ยกเลิก"
                }
              }
            }).then(function(response) {
              $http({
                url: myService.configAPI.webserviceURL + 'webservices/editPromotion.php',
                method: 'POST',
                data: {
                  var_promotionid: $scope.promotion.id,
                  var_name: $scope.promotion.name,
                  var_detail: $scope.promotion.detail,
                  var_freq: $scope.promotion.freq
                }
              }).then(function(response) {
                console.log(response);
                $mdDialog.show({
                  controller: 'DialogController',
                  templateUrl: 'confirm-dialog.html',
                  locals: {
                    displayOption: {
                      title: "แก้ไขโปรโมชันสำเร็จ !",
                      content: "คุณแก้ไขโปรโมชันสำเร็จ",
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
                      content: "เกิดข้อผิดพลาด btnEditPromotion ใน editPromotionController ระบบจะปิดอัตโนมัติ",
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
