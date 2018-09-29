appControllers.controller('loginOwnMenuCtrl', function($scope, $timeout, $mdUtil, $mdSidenav, $log, $ionicHistory, $state, $ionicPlatform, $mdDialog, $mdBottomSheet, $mdMenu, $mdSelect, $http, myService, $ionicNavBarDelegate) {
  $scope.toggleLeft = buildToggler('left');
  $scope.memberDetail = {}; // $scope.memberDetail คือ obj ข้อมูลของ member
  $scope.randomNumber = Math.random();

  $http.get(myService.configAPI.webserviceURL + 'webservices/getMemberDetail.php?memberUsername=' + window.localStorage.memberUsername)
    .then(function(response) {
      $scope.memberDetail = response.data.results[0];
      myService.memberDetailFromLogin = response.data.results[0];
    }, function(error) {
      $mdDialog.show({
        controller: 'DialogController',
        templateUrl: 'confirm-dialog.html',
        locals: {
          displayOption: {
            title: "เกิดข้อผิดพลาด !",
            content: "เกิดข้อผิดพลาด getMemberDetail ใน loginOwnMenuController ระบบจะปิดอัตโนมัติ",
            ok: "ตกลง"
          }
        }
      }).then(function(response) {
        ionic.Platform.exitApp();
      });
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
      window.localStorage.memberUsername = "";
      window.localStorage.memberType = "";
      $state.go('notlogin.login');
    });
  };

  //  $ionicPlatform.registerBackButtonAction(callback, priority, [actionId])
  //
  //     Register a hardware back button action. Only one action will execute
  //  when the back button is clicked, so this method decides which of
  //  the registered back button actions has the highest priority.
  //
  //     For example, if an actionsheet is showing, the back button should
  //  close the actionsheet, but it should not also go back a page view
  //  or close a modal which may be open.
  //
  //  The priorities for the existing back button hooks are as follows:
  //  Return to previous view = 100
  //  Close side menu         = 150
  //  Dismiss modal           = 200
  //  Close action sheet      = 300
  //  Dismiss popup           = 400
  //  Dismiss loading overlay = 500
  //
  //  Your back button action will override each of the above actions
  //  whose priority is less than the priority you provide. For example,
  //  an action assigned a priority of 101 will override the ‘return to
  //  previous view’ action, but not any of the other actions.
  //
  //  Learn more at : http://ionicframework.com/docs/api/service/$ionicPlatform/#registerBackButtonAction

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
      if ($state.current.name == 'loginown.ownbookinglist') {
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
