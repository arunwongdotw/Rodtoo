appControllers.controller('adminQueueListCtrl', function($scope, $timeout, $state, $ionicHistory, $mdDialog, $http, myService, $mdSidenav, $ionicPlatform) {
  $scope.provinceValue = "selectProvince";
  var iloop = 0;

  $http.get(myService.configAPI.webserviceURL + 'webservices/getProvinceList.php')
    .then(function(response) {
      $scope.provinceArrayList = response.data.results;
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

  $scope.setProvince = function(province_value) {
    $scope.provinceValue = province_value;
    $scope.queueArrayList = null;
  };

  $scope.getQueueList = function(province_id) {
    $http.get(myService.configAPI.webserviceURL + 'webservices/getQueueListInAdmin.php?provinceid=' + province_id)
      .then(function(response) {
        $scope.queueArrayList = response.data.results;
        iloop = 0;
        getDestination(function(status) {});
      }, function(error) {
        $mdDialog.show({
          controller: 'DialogController',
          templateUrl: 'confirm-dialog.html',
          locals: {
            displayOption: {
              title: "เกิดข้อผิดพลาด !",
              content: "เกิดข้อผิดพลาด getQueueList ใน adminQueueListController ระบบจะปิดอัตโนมัติ",
              ok: "ตกลง"
            }
          }
        }).then(function(response) {
          ionic.Platform.exitApp();
        });
      });
  };

  function getDestination(callback) {
    if (iloop < $scope.queueArrayList.length) {
      $http.get(myService.configAPI.webserviceURL + 'webservices/getDestinationInAdmin.php?provinceid=' + $scope.queueArrayList[iloop].queue_destination_province_id + '&amphurid=' + $scope.queueArrayList[iloop].queue_destination_district_id)
        .then(function(response) {
          $scope.queueArrayList[iloop].queue_destination_province_name = response.data.results[0].PROVINCE_NAME;
          $scope.queueArrayList[iloop].queue_destination_amphur_name = response.data.results[0].AMPHUR_NAME;
          iloop = iloop + 1;
          getDestination(callback);
        });
    } else {
      callback();
    }
  }

  $scope.getInfomation = function(queue_id) {
    myService.queueDetail.queue_id = queue_id;
    $state.go('loginadmin.adminqueuedetail');
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
      if ($state.current.name == 'loginadmin.adminqueuelist') {
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
