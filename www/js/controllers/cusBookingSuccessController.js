appControllers.controller('cusBookingSuccessCtrl', function($scope, $timeout, $state, $ionicHistory, $mdDialog, $http, myService, $mdSidenav) {

  $http.get(myService.configAPI.webserviceURL + 'webservices/getBooking.php?bookingid=' + myService.bookingDetail.bookingID)
    .then(function(response) {
      $scope.bookingDetail = response.data.results[0];
    }, function(error) {
      $mdDialog.show({
        controller: 'DialogController',
        templateUrl: 'confirm-dialog.html',
        locals: {
          displayOption: {
            title: "เกิดข้อผิดพลาด !",
            content: "เกิดข้อผิดพลาด getBooking ใน bookingSuccessController ระบบจะปิดอัตโนมัติ",
            ok: "ตกลง"
          }
        }
      }).then(function(response) {
        ionic.Platform.exitApp();
      });
    });

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

  $scope.btnBack = function() {
    $scope.navigateTo('logincus.booking');
  };
});
