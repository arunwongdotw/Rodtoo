appControllers.controller('loginCtrl', function($scope, $timeout, $state, $ionicHistory, $mdDialog, $http, myService, $mdSidenav, $cordovaDevice) {
  $scope.login = {};

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

  $scope.btnSignIn = function() {
    var uuid = $cordovaDevice.getUUID();
    if (($scope.login.username != null) && ($scope.login.username != "")) {
      if (($scope.login.password != null) && ($scope.login.password != "")) {
        $http({
          url: myService.configAPI.webserviceURL + 'webservices/login.php',
          method: 'POST',
          data: {
            var_username: $scope.login.username,
            var_password: $scope.login.password,
            var_uuid: uuid,
            var_token: window.localStorage.token
          }
        }).then(function(response) {
          if (response.data.results == 'notfound_username') {
            $mdDialog.show({
              controller: 'DialogController',
              templateUrl: 'confirm-dialog.html',
              locals: {
                displayOption: {
                  title: "Username ไม่ถูกต้อง !",
                  content: "ไม่พบ Username ที่กรอกในระบบ กรุณากรอกใหม่",
                  ok: "ตกลง"
                }
              }
            });
          } else if (response.data.results == 'wrong_password') {
            $mdDialog.show({
              controller: 'DialogController',
              templateUrl: 'confirm-dialog.html',
              locals: {
                displayOption: {
                  title: "Password ไม่ถูกต้อง !",
                  content: "Password ที่กรอกไม่ถูกต้อง กรุณากรอกใหม่",
                  ok: "ตกลง"
                }
              }
            });
          } else {
            $scope.response = response.data.results[0];
            if ($scope.response.member_type == 1) {
              $mdDialog.show({
                controller: 'DialogController',
                templateUrl: 'confirm-dialog.html',
                locals: {
                  displayOption: {
                    title: "เข้าสู่ระบบสำเร็จ !",
                    content: "คุณเข้าสู่ระบบสำเร็จ",
                    ok: "ตกลง"
                  }
                }
              }).then(function(response) {
                window.localStorage.memberUsername = $scope.login.username;
                window.localStorage.memberType = $scope.response.member_type;
                $state.go('logincus.cusprofile');
              });
            } else if ($scope.response.member_type == 2) {
              if ($scope.response.member_type_status == 1) {
                $mdDialog.show({
                  controller: 'DialogController',
                  templateUrl: 'confirm-dialog.html',
                  locals: {
                    displayOption: {
                      title: "เข้าสู่ระบบไม่สำเร็จ !",
                      content: "คุณเข้าสู่ระบบไม่สำเร็จ เพราะยังไม่ได้รับการอนุมัติจากผู้ดูแลระบบ",
                      ok: "ตกลง"
                    }
                  }
                });
              } else if ($scope.response.member_type_status == 2) {
                $mdDialog.show({
                  controller: 'DialogController',
                  templateUrl: 'confirm-dialog.html',
                  locals: {
                    displayOption: {
                      title: "เข้าสู่ระบบสำเร็จ !",
                      content: "คุณเข้าสู่ระบบสำเร็จ",
                      ok: "ตกลง"
                    }
                  }
                }).then(function(response) {
                  myService.memberDetailFromLogin = $scope.response;
                  window.localStorage.memberUsername = $scope.login.username;
                  window.localStorage.memberType = $scope.response.member_type;
                  $state.go('loginown.ownprofile');
                });
              }
            } else if ($scope.response.member_type == 3) {
              $mdDialog.show({
                controller: 'DialogController',
                templateUrl: 'confirm-dialog.html',
                locals: {
                  displayOption: {
                    title: "เข้าสู่ระบบสำเร็จ !",
                    content: "คุณเข้าสู่ระบบสำเร็จ",
                    ok: "ตกลง"
                  }
                }
              }).then(function(response) {
                myService.memberDetailFromLogin = $scope.response;
                window.localStorage.memberUsername = $scope.login.username;
                window.localStorage.memberType = $scope.response.member_type;
                $state.go('loginvan.vanprofile');
              });
            } else if ($scope.response.member_type == 4) {
              $mdDialog.show({
                controller: 'DialogController',
                templateUrl: 'confirm-dialog.html',
                locals: {
                  displayOption: {
                    title: "เข้าสู่ระบบสำเร็จ !",
                    content: "คุณเข้าสู่ระบบสำเร็จ",
                    ok: "ตกลง"
                  }
                }
              }).then(function(response) {
                myService.memberDetailFromLogin = $scope.response;
                window.localStorage.memberUsername = $scope.login.username;
                window.localStorage.memberType = $scope.response.member_type;
                $state.go('loginadmin.adminpaymentlist');
              });
            }
          }
        }, function(error) {
          $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            locals: {
              displayOption: {
                title: "เกิดข้อผิดพลาด !",
                content: "เกิดข้อผิดพลาด btnSignIn ใน loginController ระบบจะปิดอัตโนมัติ",
                ok: "ตกลง"
              }
            }
          }).then(function(response) {
            ionic.Platform.exitApp();
          });
        });
      } else {
        $mdDialog.show({
          controller: 'DialogController',
          templateUrl: 'confirm-dialog.html',
          locals: {
            displayOption: {
              title: "Password ไม่ถูกต้อง !",
              content: "กรุณากรอก Password",
              ok: "ตกลง"
            }
          }
        });
      }
    } else {
      $mdDialog.show({
        controller: 'DialogController',
        templateUrl: 'confirm-dialog.html',
        locals: {
          displayOption: {
            title: "Username ไม่ถูกต้อง !",
            content: "กรุณากรอก Username",
            ok: "ตกลง"
          }
        }
      });
    }
  };
});
