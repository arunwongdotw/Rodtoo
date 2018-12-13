appControllers.controller('loginVanMenuCtrl', function($scope, $timeout, $mdUtil, $mdSidenav, $log, $ionicHistory, $state, $ionicPlatform, $mdDialog, $mdBottomSheet, $mdMenu, $mdSelect, $http, myService, $cordovaDevice) {
  $scope.toggleLeft = buildToggler('left');
  $scope.memberDetail = {}; // $scope.memberDetail คือ obj ข้อมูลของ member
  $scope.randomNumber = Math.random();

  $scope.$on('$ionicView.enter', function() {
    $scope.randomNumber = Math.random();
  });

  $http.get(myService.configAPI.webserviceURL + 'webservices/getMemberDetail.php?memberUsername=' + window.localStorage.memberUsername)
    .then(function(response) {
      $scope.memberDetail = response.data.results[0];
      myService.memberDetailFromLogin = response.data.results[0];
    });

  function buildToggler(navID) {
    var debounceFn = $mdUtil.debounce(function() {
      $mdSidenav(navID).toggle();
    }, 0);
    return debounceFn;
  }

  $scope.navigateTo = function(stateName) {
    if (stateName != "loginvan.vanmap") {
      checkVanStatus(function(status) {
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

  function checkVanStatus(callback) {
    $http({
      url: myService.configAPI.webserviceURL + 'webservices/checkVanStatusByID.php',
      method: 'POST',
      data: {
        var_memberid: $scope.memberDetail.member_id
      }
    }).then(function(response) {
      if (response.data.results == "checkVanStatus_isOne") {
        callback();
      } else if (response.data.results == "checkVanStatus_isTwo") {
        $mdDialog.show({
          controller: 'DialogController',
          templateUrl: 'confirm-dialog.html',
          locals: {
            displayOption: {
              title: "สถานะการเดินทางของรถตู้ไม่ถูกต้อง !",
              content: "กรุณากดหยุดเดินทางก่อนเปลี่ยนเมนู",
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
            content: "เกิดข้อผิดพลาด checkVanStatus ใน vanMapController ระบบจะปิดอัตโนมัติ",
            ok: "ตกลง"
          }
        }
      }).then(function(response) {
        ionic.Platform.exitApp();
      });
    });
  }

  $scope.closeSideNav = function() {
    $mdSidenav('left').close();
  };

  $scope.btnLogout = function() {
    checkVanStatus(function(status) {
      $mdDialog.show({
        controller: 'DialogController',
        templateUrl: 'confirm-dialog.html',
        locals: {
          displayOption: {
            title: "ออกจากระบบ ?",
            content: "คุณต้องการที่จะออกจากระบบ",
            ok: "ตกลง",
            cancel: "ยกเลิก"
          }
        }
      }).then(function(response) {
        var uuid = $cordovaDevice.getUUID();
        window.localStorage.memberUsername = "";
        window.localStorage.memberType = "";
        $http({
          url: myService.configAPI.webserviceURL + 'webservices/deleteNotification.php',
          method: 'POST',
          data: {
            var_uuid: uuid,
            var_token: window.localStorage.token,
            var_memberid: myService.memberDetailFromLogin.member_id
          }
        }).then(function(response) {
          // window.localStorage.clear();
          $state.go('notlogin.login');
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
      if ($state.current.name == 'loginvan.vanprofile') {
        if (jQuery('[id^=dialog]').length == 0) {
          $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            targetEvent: null,
            locals: {
              displayOption: {
                title: "ออกจากแอปพลิเคชัน",
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
