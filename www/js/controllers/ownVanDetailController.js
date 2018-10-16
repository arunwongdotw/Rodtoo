appControllers.controller('ownVanDetailCtrl', function($scope, $timeout, $state, $ionicHistory, $mdDialog, $http, myService, $mdSidenav, $ionicNavBarDelegate, $cordovaInAppBrowser) {

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
    $scope.navigateTo('loginown.ownvanlist');
  };

  $http.get(myService.configAPI.webserviceURL + 'webservices/getVanDetail.php?vanid=' + myService.vanIDInList.van_id)
    .then(function(response) {
      $scope.vanDetail = response.data.results[0];
      getProvince($scope.vanDetail.member_province_id);
    }, function(error) {
      $mdDialog.show({
        controller: 'DialogController',
        templateUrl: 'confirm-dialog.html',
        locals: {
          displayOption: {
            title: "เกิดข้อผิดพลาด !",
            content: "เกิดข้อผิดพลาด getBooking ใน ownVanDetailController ระบบจะปิดอัตโนมัติ",
            ok: "ตกลง"
          }
        }
      }).then(function(response) {
        ionic.Platform.exitApp();
      });
    });

  function getProvince(province_id) {
    $http.get(myService.configAPI.webserviceURL + 'webservices/getProvince.php?provinceid=' + province_id)
      .then(function(response) {
        $scope.provinceDetail = response.data.results[0];
      }, function(error) {
        $mdDialog.show({
          controller: 'DialogController',
          templateUrl: 'confirm-dialog.html',
          locals: {
            displayOption: {
              title: "เกิดข้อผิดพลาด !",
              content: "เกิดข้อผิดพลาด getProvince ใน ownVanDetailController ระบบจะปิดอัตโนมัติ",
              ok: "ตกลง"
            }
          }
        }).then(function(response) {
          ionic.Platform.exitApp();
        });
      });
  }

  $scope.openLink = function(member_username) {
    var options = {
      location: 'yes',
      clearcache: 'yes',
      toolbar: 'no'
    };
    $cordovaInAppBrowser.open('http://1did.net/rodtoo/img/img_evidence/' + member_username + '.jpg', '_system', options);
  };

  $scope.btnConfirmVan = function(van_id) {
    $mdDialog.show({
      controller: 'DialogController',
      templateUrl: 'confirm-dialog.html',
      locals: {
        displayOption: {
          title: "ยืนยันข้อมูลรถตู้ ?",
          content: "คุณแน่ใจที่จะยืนยันข้อมูลรถตู้",
          ok: "ตกลง",
          cancel: "ยกเลิก"
        }
      }
    }).then(function(response) {
      $http({
        url: myService.configAPI.webserviceURL + 'webservices/confirmVan.php',
        method: 'POST',
        data: {
          var_vanid: van_id,
        }
      }).then(function(response) {
        $mdDialog.show({
          controller: 'DialogController',
          templateUrl: 'confirm-dialog.html',
          locals: {
            displayOption: {
              title: "ยืนยันข้อมูลรถตู้สำเร็จ !",
              content: "คุณยืนยันข้อมูลรถตู้สำเร็จ",
              ok: "ตกลง"
            }
          }
        }).then(function(response) {
          $state.go('loginown.ownvanlist');
        });
      }, function(error) {
        $mdDialog.show({
          controller: 'DialogController',
          templateUrl: 'confirm-dialog.html',
          locals: {
            displayOption: {
              title: "เกิดข้อผิดพลาด !",
              content: "เกิดข้อผิดพลาด btnConfirmVan ใน ownVanDetailController ระบบจะปิดอัตโนมัติ",
              ok: "ตกลง"
            }
          }
        }).then(function(response) {
          ionic.Platform.exitApp();
        });
      });
    });
  };

  $scope.btnCancelVan = function(van_id) {
    $mdDialog.show({
      controller: 'DialogController',
      templateUrl: 'confirm-dialog.html',
      locals: {
        displayOption: {
          title: "ปฏิเสธข้อมูลรถตู้ ?",
          content: "คุณแน่ใจที่จะปฏิเสธข้อมูลรถตู้",
          ok: "ตกลง",
          cancel: "ยกเลิก"
        }
      }
    }).then(function(response) {
      $http({
        url: myService.configAPI.webserviceURL + 'webservices/deleteVan.php',
        method: 'POST',
        data: {
          var_vanid: van_id,
        }
      }).then(function(response) {
        $mdDialog.show({
          controller: 'DialogController',
          templateUrl: 'confirm-dialog.html',
          locals: {
            displayOption: {
              title: "ยืนยันข้อมูลรถตู้สำเร็จ !",
              content: "คุณยืนยันข้อมูลรถตู้สำเร็จ",
              ok: "ตกลง"
            }
          }
        }).then(function(response) {
          $state.go('loginown.ownvanlist');
        });
      }, function(error) {
        $mdDialog.show({
          controller: 'DialogController',
          templateUrl: 'confirm-dialog.html',
          locals: {
            displayOption: {
              title: "เกิดข้อผิดพลาด !",
              content: "เกิดข้อผิดพลาด btnConfirmVan ใน ownVanDetailController ระบบจะปิดอัตโนมัติ",
              ok: "ตกลง"
            }
          }
        }).then(function(response) {
          ionic.Platform.exitApp();
        });
      });
    });
  };
});
