appControllers.controller('bookingListCtrl', function($scope, $timeout, $state, $ionicHistory, $mdDialog, $http, myService, $mdSidenav) {
  myService.memberDetailFromLogin.member_id = "1"; // for test

  $http.get(myService.configAPI.webserviceURL + 'webservices/getBookingList.php?memberid=' + myService.memberDetailFromLogin.member_id)
    .then(function(response) {
      $scope.bookingListArrayList = response.data.results;
    }, function(error) {
      $mdDialog.show({
        controller: 'DialogController',
        templateUrl: 'confirm-dialog.html',
        locals: {
          displayOption: {
            title: "เกิดข้อผิดพลาด !",
            content: "เกิดข้อผิดพลาด getBookingList ใน bookingListController ระบบจะปิดอัตโนมัติ",
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

  $scope.getInfomation = function(booking_id) {
    myService.bookingIDInList.booking_id = booking_id;
    $state.go('logincus.bookingdetail');
  };

  $scope.getPayment = function(booking_id) {
    myService.bookingIDInList.booking_id = booking_id;
    $state.go('logincus.payment');
  };
});
