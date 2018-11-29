appControllers.controller('notLoginMenuCtrl', function($scope, $timeout, $mdUtil, $mdSidenav, $log, $ionicHistory, $state, $ionicPlatform, $mdDialog, $mdBottomSheet, $mdMenu, $mdSelect, $http, myService, $cordovaDevice) {
  $scope.toggleLeft = buildToggler('left');

  function buildToggler(navID) {
    var debounceFn = $mdUtil.debounce(function() {
      $mdSidenav(navID).toggle();
    }, 0);
    return debounceFn;
  }

  $scope.navigateTo = function(stateName) {
    if (stateName == "notlogin.map") {
      inputCode(function(status) {
        $timeout(function() {
          $mdSidenav('left').close();
          if ($ionicHistory.currentStateName() != stateName) {
            $ionicHistory.nextViewOptions({
              disableAnimate: true,
              disableBack: true
            });
            $state.go(stateName);
          }
        }, ($scope.isAndroid == false ? 300 : 0));
      });
    } else {
      $timeout(function() {
        $mdSidenav('left').close();
        if ($ionicHistory.currentStateName() != stateName) {
          $ionicHistory.nextViewOptions({
            disableAnimate: true,
            disableBack: true
          });
          $state.go(stateName);
        }
      }, ($scope.isAndroid == false ? 300 : 0));
    }
  };

  $scope.closeSideNav = function() {
    $mdSidenav('left').close();
  };

  function inputCode(callback) {
    $mdDialog.show({
        controller: 'inputDialogController',
        templateUrl: 'input-dialog.html',
        locals: {
          displayOption: {
            title: "ติดตามการฝากของ ?",
            content: "คุณต้องการที่จะติดตามการฝากของ (เมื่อกดใช้โค้ดแล้ว จะสามารถใช้โค้ดได้แค่ในโทรศัพท์เครื่องที่กดใช้ครั้งแรกเท่านั้น)",
            inputplaceholder: "กรุณากรอกโค้ด",
            ok: "ยืนยัน",
            cancel: "ยกเลิก"
          }
        }
      }).then(function(response) {
        var uuid = $cordovaDevice.getUUID();
        $http({
          url: myService.configAPI.webserviceURL + 'webservices/checkCode.php',
          method: 'POST',
          data: {
            var_code: myService.inputDialog.code
          }
        }).then(function(response) {
          if (response.data.results == "checkCode_notHaveCode") {
            $mdDialog.show({
              controller: 'DialogController',
              templateUrl: 'confirm-dialog.html',
              locals: {
                displayOption: {
                  title: "โค้ดไม่ถูกต้อง !",
                  content: "ไม่พบโค้ดในระบบ กรุณากรอกโค้ดใหม่",
                  ok: "ตกลง"
                }
              }
            });
          } else if (response.data.results == "checkCode_vanNotStart") {
            $mdDialog.show({
              controller: 'DialogController',
              templateUrl: 'confirm-dialog.html',
              locals: {
                displayOption: {
                  title: "ติดตามการฝากของไม่ถูกต้อง !",
                  content: "รถตู้ยังไม่ได้ออกเดินทาง กรุณาลองใหม่ภายหลัง",
                  ok: "ตกลง"
                }
              }
            });
          } else if (response.data.results == "checkCode_codeUnavailable") {
            $mdDialog.show({
              controller: 'DialogController',
              templateUrl: 'confirm-dialog.html',
              locals: {
                displayOption: {
                  title: "โค้ดไม่ถูกต้อง !",
                  content: "โค้ดนี้ไม่สามารถใช้งานได้แล้ว",
                  ok: "ตกลง"
                }
              }
            });
          } else if (response.data.results == "checkCode_codeAvailable") {
            myService.vanDetail.van_id = response.data.vanid;
            $http({
              url: myService.configAPI.webserviceURL + 'webservices/insertCodeUsed.php',
              method: 'POST',
              data: {
                var_code: myService.inputDialog.code,
                var_uuid: uuid
              }
            }).then(function(response) {
              console.log(response);
              if (response.data.results == "insertCodeUsed_notEqual") {
                $mdDialog.show({
                  controller: 'DialogController',
                  templateUrl: 'confirm-dialog.html',
                  locals: {
                    displayOption: {
                      title: "โค้ดไม่ถูกต้อง !",
                      content: "โค้ดนี้ถูกใช้งานโดยโทรศัพท์เครื่องอื่นแล้ว",
                      ok: "ตกลง"
                    }
                  }
                });
              } else {
                callback();
              }
            }, function(response) {
              $mdDialog.show({
                controller: 'DialogController',
                templateUrl: 'confirm-dialog.html',
                locals: {
                  displayOption: {
                    title: "เกิดข้อผิดพลาด !",
                    content: "เกิดข้อผิดพลาด checkCode ใน notLoginMenuController ระบบจะปิดอัตโนมัติ",
                    ok: "ตกลง"
                  }
                }
              }).then(function(response) {
                ionic.Platform.exitApp();
              });
            });
          }
        }, function(error) {
          $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            locals: {
              displayOption: {
                title: "เกิดข้อผิดพลาด !",
                content: "เกิดข้อผิดพลาด checkCode ใน notLoginMenuController ระบบจะปิดอัตโนมัติ",
                ok: "ตกลง"
              }
            }
          }).then(function(response) {
            ionic.Platform.exitApp();
          });
        });
      });
  }

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
      if ($state.current.name == 'notlogin.login') {
        if (jQuery('[id^=dialog]').length == 0) {
          $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            targetEvent: null,
            locals: {
              displayOption: {
                title: "การยืนยัน",
                content: "คุณแน่ใจที่จะออกจากแอปพลิเคชัน ?",
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
