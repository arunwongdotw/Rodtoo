appControllers.controller('loginOwnMenuCtrl', function($scope, $timeout, $mdUtil, $mdSidenav, $log, $ionicHistory, $state, $ionicPlatform, $mdDialog, $mdBottomSheet, $mdMenu, $mdSelect, $http, myService, $cordovaDevice) {
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
  };

  function navigateTo(stateName) {
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

  $scope.closeSideNav = function() {
    $mdSidenav('left').close();
  };

  $scope.btnLogout = function() {
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
  };

  $scope.checkQueue = function(state) {
    $http({
      url: myService.configAPI.webserviceURL + 'webservices/checkHaveQueue.php',
      method: 'POST',
      data: {
        var_memberid: myService.memberDetailFromLogin.member_id
      }
    }).then(function(response) {
      if (response.data.results == "checkHaveQueue_isZero") {
        $mdDialog.show({
          controller: 'DialogController',
          templateUrl: 'confirm-dialog.html',
          locals: {
            displayOption: {
              title: "รายการข้อมูลรถตู้ไม่ถูกต้อง !",
              content: "คุณต้องลงทะบียนคิวรถตู้ก่อน ระบบจะนำทางไปอัตโนมัติ",
              ok: "ตกลง",
              cancel: "ยกเลิก"
            }
          }
        }).then(function(response) {
          navigateTo('loginown.queue');
        });
      } else if (response.data.results == "checkHaveQueue_notZero") {
        navigateTo(state);
      }
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
      if ($state.current.name == 'loginown.ownprofile') {
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
