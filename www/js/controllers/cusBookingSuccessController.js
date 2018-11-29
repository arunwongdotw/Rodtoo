appControllers.controller('cusBookingSuccessCtrl', function($scope, $timeout, $state, $ionicHistory, $mdDialog, $http, myService, $mdSidenav) {
  $scope.bookingID = myService.bookingDetail.bookingID;

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
            content: "เกิดข้อผิดพลาด getBooking ใน cusBookingSuccessController ระบบจะปิดอัตโนมัติ",
            ok: "ตกลง"
          }
        }
      }).then(function(response) {
        ionic.Platform.exitApp();
      });
    });

  $scope.btnPayment = function(booking_id) {
    myService.bookingIDInList.booking_id = booking_id;
    $state.go('logincus.payment');
  };
});
