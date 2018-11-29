appControllers.controller('ownPointListCtrl', function($scope, $timeout, $state, $ionicHistory, $mdDialog, $http, myService, $mdSidenav, $ionicNavBarDelegate, $ionicPlatform) {

  $scope.$on('$ionicView.enter', function(e) {
    $ionicNavBarDelegate.showBar(true);
  });

  $http.get(myService.configAPI.webserviceURL + 'webservices/getOwnPointList.php?memberid=' + myService.memberDetailFromLogin.member_id)
    .then(function(response) {
      $scope.ownPointArrayList = response.data.results;
    }, function(error) {
      $mdDialog.show({
        controller: 'DialogController',
        templateUrl: 'confirm-dialog.html',
        locals: {
          displayOption: {
            title: "เกิดข้อผิดพลาด !",
            content: "เกิดข้อผิดพลาด getOwnPointList ใน ownPointListController ระบบจะปิดอัตโนมัติ",
            ok: "ตกลง"
          }
        }
      }).then(function(response) {
        ionic.Platform.exitApp();
      });
    });
    
  $scope.btnAddPoint = function() {
    $http({
      url: myService.configAPI.webserviceURL + 'webservices/checkPoint.php',
      method: 'POST',
      data: {
        var_memberid: $scope.memberDetail.member_id
      }
    }).then(function(response) {
      $scope.results = response.data.results;
      if ($scope.results == 'checkPoint_lessthan') {
        $state.go('loginown.addpoint');
      } else if ($scope.results == 'checkPoint_morethan') {
        $mdDialog.show({
          controller: 'DialogController',
          templateUrl: 'confirm-dialog.html',
          locals: {
            displayOption: {
              title: "จุดลงรถตู้เกิน !",
              content: "คุณไม่สามารถเพิ่มจุดลงรถตู้ได้ เนื่องจากจุดลงรถตู้เกินกว่าที่กำหนด",
              ok: "ตกลง"
            }
          }
        });
      }
    }, function(error) {
      $mdDialog.show({
        controller: 'DialogController',
        templateUrl: 'confirm-dialog.html',
        locals: {
          displayOption: {
            title: "เกิดข้อผิดพลาด !",
            content: "เกิดข้อผิดพลาด btnAddPoint ใน ownPointListController ระบบจะปิดอัตโนมัติ",
            ok: "ตกลง"
          }
        }
      }).then(function(response) {
        ionic.Platform.exitApp();
      });
    });
  };

  $scope.editPoint = function(point_id) {
    myService.editPoint.point_id = point_id;
    $state.go('loginown.editpoint');
  };

  $scope.delPoint = function(point_id) {
    $mdDialog.show({
      controller: 'DialogController',
      templateUrl: 'confirm-dialog.html',
      locals: {
        displayOption: {
          title: "ลบจุดลงรถตู้ ?",
          content: "คุณแน่ใจที่จะลบจุดลงรถตู้",
          ok: "ตกลง",
          cancel: "ยกเลิก"
        }
      }
    }).then(function(response) {
      $http({
        url: myService.configAPI.webserviceURL + 'webservices/delPoint.php',
        method: 'POST',
        data: {
          var_pointid: point_id,
        }
      }).then(function(response) {
        $mdDialog.show({
          controller: 'DialogController',
          templateUrl: 'confirm-dialog.html',
          locals: {
            displayOption: {
              title: "ลบจุดลงรถตู้สำเร็จ !",
              content: "คุณลบจุดลงรถตู้สำเร็จ",
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
              content: "เกิดข้อผิดพลาด delPoint ใน ownPointListController ระบบจะปิดอัตโนมัติ",
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
      if ($state.current.name == 'loginown.ownpointlist') {
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
