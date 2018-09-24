appControllers.controller('ownBookingListCtrl', function($scope, $timeout, $state, $ionicHistory, $mdDialog, $http, myService, $mdSidenav) {

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
});
