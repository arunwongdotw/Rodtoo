appControllers.controller('vanBookingListCtrl', function($scope, $timeout, $state, $ionicHistory, $mdDialog, $http, myService, $mdSidenav) {

  $http.get(myService.configAPI.webserviceURL + 'webservices/getVanBookingList.php?memberid=' + myService.memberDetailFromLogin.member_id)
    .then(function(response) {
      $scope.vanBookingArrayList = response.data.results;
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
    $state.go('loginvan.vanbookingdetail');
  };
});
