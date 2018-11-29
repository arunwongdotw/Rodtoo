appControllers.controller('ownPromotionListCtrl', function($scope, $timeout, $state, $ionicHistory, $mdDialog, $http, myService, $mdSidenav, $ionicNavBarDelegate, $ionicPlatform) {

  $scope.$on('$ionicView.enter', function(e) {
    $ionicNavBarDelegate.showBar(true);
  });

  $http.get(myService.configAPI.webserviceURL + 'webservices/getPromotionList.php?memberid=' + myService.memberDetailFromLogin.member_id)
    .then(function(response) {
      $scope.promotionArrayList = response.data.results;
    }, function(error) {
      $mdDialog.show({
        controller: 'DialogController',
        templateUrl: 'confirm-dialog.html',
        locals: {
          displayOption: {
            title: "เกิดข้อผิดพลาด !",
            content: "เกิดข้อผิดพลาด getPromotionList ใน ownPromotionListController ระบบจะปิดอัตโนมัติ",
            ok: "ตกลง"
          }
        }
      }).then(function(response) {
        ionic.Platform.exitApp();
      });
    });
    
  $scope.btnAddPromotion = function() {
    $http({
      url: myService.configAPI.webserviceURL + 'webservices/checkPromotion.php',
      method: 'POST',
      data: {
        var_memberid: myService.memberDetailFromLogin.member_id
      }
    }).then(function(response) {
      if (response.data.results == "checkPromotion_have") {
        $mdDialog.show({
          controller: 'DialogController',
          templateUrl: 'confirm-dialog.html',
          locals: {
            displayOption: {
              title: "เพิ่มโปรโมชันไม่ถูกต้อง !",
              content: "พบโปรโมชันของคิวรถตู้มีอยู่ในระบบแล้ว กรุณาแก้ไขหรือลบเพื่อเพิ่มโปรโมชันใหม่",
              ok: "ตกลง"
            }
          }
        });
      } else {
        $state.go('loginown.addpromotion');
      }
    }, function(error) {
      $mdDialog.show({
        controller: 'DialogController',
        templateUrl: 'confirm-dialog.html',
        locals: {
          displayOption: {
            title: "เกิดข้อผิดพลาด !",
            content: "เกิดข้อผิดพลาด btnAddPromotion ใน ownPromotionListController ระบบจะปิดอัตโนมัติ",
            ok: "ตกลง"
          }
        }
      }).then(function(response) {
        ionic.Platform.exitApp();
      });
    });
  };

  $scope.editPromotion = function(promotion_id) {
    myService.editPromotion.promotion_id = promotion_id;
    $state.go('loginown.editpromotion');
  };

  $scope.delPromotion = function(promotion_id) {
    $mdDialog.show({
      controller: 'DialogController',
      templateUrl: 'confirm-dialog.html',
      locals: {
        displayOption: {
          title: "ลบโปรโมชัน ?",
          content: "คุณแน่ใจที่จะลบโปรโมชันนี้",
          ok: "ตกลง",
          cancel: "ยกเลิก"
        }
      }
    }).then(function(response) {
      $http({
        url: myService.configAPI.webserviceURL + 'webservices/delPromotion.php',
        method: 'POST',
        data: {
          var_promotionid: promotion_id,
        }
      }).then(function(response) {
        $mdDialog.show({
          controller: 'DialogController',
          templateUrl: 'confirm-dialog.html',
          locals: {
            displayOption: {
              title: "ลบโปรโมชันสำเร็จ !",
              content: "คุณลบโปรโมชันสำเร็จ",
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
              content: "เกิดข้อผิดพลาด delPromotion ใน ownPromotionListController ระบบจะปิดอัตโนมัติ",
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
      if ($state.current.name == 'loginown.ownpromotionlist') {
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
