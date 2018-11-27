appControllers.controller('ownDepositGenerateCodeCtrl', function($scope, $timeout, $state, $ionicHistory, $mdDialog, $http, myService, $mdSidenav, $ionicNavBarDelegate, $ionicPlatform) {

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
    $scope.navigateTo('loginown.owndepositvanselect');
  };

  function checkDup(fullCode, callback) {
    $http({
      url: myService.configAPI.webserviceURL + 'webservices/checkDupCode.php',
      method: 'POST',
      data: {
        var_code: fullCode
      }
    }).then(function(response) {
      if (response.data.results == "checkDupCode_isDup") {
        $scope.checkDupCode = true;
        callback();
      } else {
        $scope.checkDupCode = false;
        callback();
      }
    }, function(error) {
      $mdDialog.show({
        controller: 'DialogController',
        templateUrl: 'confirm-dialog.html',
        locals: {
          displayOption: {
            title: "เกิดข้อผิดพลาด !",
            content: "เกิดข้อผิดพลาด checkDup ใน ownDepositGenerateCodeController ระบบจะปิดอัตโนมัติ",
            ok: "ตกลง"
          }
        }
      }).then(function(response) {
        ionic.Platform.exitApp();
      });
    });
  }

  function makeid(callback) {
    var code = "";
    var possible = "ABCDEFGHIJKLMNPQRSTUVWXYZ123456789";
    for (var i = 0; i < 6; i++) {
      code += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    concatCodeWithPlate(code, function(status) {
      var fullCode = status;
      checkDup(fullCode, function(status) {
        if ($scope.checkDupCode == true) {
          makeid(callback);
        } else {
          callback(fullCode);
        }
      });
    });
  }

  function concatCodeWithPlate(code, callback) {
    var fourDigit = myService.vanDetail.van_plate_no.split("-");
    var fullCode = code + "-" + fourDigit[1];
    callback(fullCode);
  }

  $scope.btnCodeGenerate = function() {
    $mdDialog.show({
      controller: 'DialogController',
      templateUrl: 'confirm-dialog.html',
      locals: {
        displayOption: {
          title: "สร้างโค้ดฝากของ ?",
          content: "คุณแน่ใจที่จะสร้างโค้ดฝากของ",
          ok: "ตกลง",
          cancel: "ยกเลิก"
        }
      }
    }).then(function(response) {
      makeid(function(status) {
        var fullCode = status;
        $http({
          url: myService.configAPI.webserviceURL + 'webservices/insertCode.php',
          method: 'POST',
          data: {
            var_code: fullCode,
            var_memberid: myService.memberDetailFromLogin.member_id,
            var_vanid: myService.vanDetail.van_id
          }
        }).then(function(response) {
          $scope.code = fullCode;
          $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            locals: {
              displayOption: {
                title: "สร้างโค้ดฝากของสำเร็จ !",
                content: "คุณสามารถสร้างโค้ดฝากของสำเร็จ",
                ok: "ตกลง"
              }
            }
          });
        }, function(error) {
          $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            locals: {
              displayOption: {
                title: "เกิดข้อผิดพลาด !",
                content: "เกิดข้อผิดพลาด btnCodeGenerate ใน ownDepositGenerateCodeController ระบบจะปิดอัตโนมัติ",
                ok: "ตกลง"
              }
            }
          }).then(function(response) {
            ionic.Platform.exitApp();
          });
        });
      });
    });
  };
});
