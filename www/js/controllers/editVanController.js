appControllers.controller('editVanCtrl', function($scope, $timeout, $state, $stateParams, $ionicHistory, $http, myService, $mdDialog, $cordovaFileTransfer, $cordovaCamera) {
  $scope.van = {};

  $http.get(myService.configAPI.webserviceURL + 'webservices/getEditVan.php?vanid=' + myService.editVan.van_id)
    .then(function(response) {
      $scope.van.firstname = response.data.results[0].van_own_firstname;
      $scope.van.lastname = response.data.results[0].van_own_lastname;
      $scope.van.phone = response.data.results[0].van_phone;
      $scope.van.queueno = response.data.results[0].van_queue_no;
      $scope.van.plateno = response.data.results[0].van_plate_no;
    }, function(error) {
      $mdDialog.show({
        controller: 'DialogController',
        templateUrl: 'confirm-dialog.html',
        locals: {
          displayOption: {
            title: "เกิดข้อผิดพลาด !",
            content: "เกิดข้อผิดพลาด getEditVan ใน editVanController ระบบจะปิดอัตโนมัติ",
            ok: "ตกลง"
          }
        }
      }).then(function(response) {
        ionic.Platform.exitApp();
      });
    });

  $scope.navigateTo = function(stateName) {
    $timeout(function() {
      if ($ionicHistory.currentStateName() != stateName) {
        $ionicHistory.nextViewOptions({
          disableAnimate: false,
          disableBack: true
        });
        $state.go(stateName);
      }
    }, ($scope.isAnimated ? 300 : 0));
  };

  $scope.btnBack = function() {
    $scope.navigateTo('loginown.ownvanlist');
  };

  $scope.btnEditVan = function() {
    var checkNumberRegEx = /^[0-9]+$/;
    if (($scope.van.firstname != null) && ($scope.van.firstname != "")) {
      if (($scope.van.lastname != null) && ($scope.van.lastname != "")) {
        if (($scope.van.phone != null) && ($scope.van.phone != "")) {
          if (checkNumberRegEx.test($scope.van.phone)) {
            if (($scope.van.queueno != null) && ($scope.van.queueno != "")) {
              $mdDialog.show({
                controller: 'DialogController',
                templateUrl: 'confirm-dialog.html',
                locals: {
                  displayOption: {
                    title: "แก้ไขข้อมูลรถตู้ ?",
                    content: "คุณแน่ใจที่จะแก้ไขข้อมูลรถตู้",
                    ok: "ตกลง",
                    cancel: "ยกเลิก"
                  }
                }
              }).then(function(response) {
                $http({
                  url: myService.configAPI.webserviceURL + 'webservices/checkQueueNo.php',
                  method: 'POST',
                  data: {
                    var_queueno: $scope.van.queueno
                  }
                }).then(function(response) {
                  $scope.response = response.data.results;
                  if ($scope.response == 'checkQueueNo_notfound') {
                    if (($scope.van.plateno != null) && ($scope.van.plateno != "")) {
                      $http({
                        url: myService.configAPI.webserviceURL + 'webservices/editVan.php',
                        method: 'POST',
                        data: {
                          var_vanid: myService.editVan.van_id,
                          var_firstname: $scope.van.firstname,
                          var_lastname: $scope.van.lastname,
                          var_phone: $scope.van.phone,
                          var_queueno: $scope.van.queueno,
                          var_plateno: $scope.van.plateno
                        }
                      }).then(function(response) {
                        $mdDialog.show({
                          controller: 'DialogController',
                          templateUrl: 'confirm-dialog.html',
                          locals: {
                            displayOption: {
                              title: "แก้ไขข้อมูลรถตู้สำเร็จ !",
                              content: "คุณแก้ไขข้อมูลรถตู้สำเร็จ",
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
                              content: "เกิดข้อผิดพลาด btnEditVan ใน editVanController ระบบจะปิดอัตโนมัติ",
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
                            title: "ป้ายทะเบียนรถไม่ถูกต้อง !",
                            content: "กรุณากรอกป้ายทะเบียนรถ",
                            ok: "ตกลง"
                          }
                        }
                      });
                    }
                  } else if ($scope.response == 'checkQueueNo_found') {
                    $mdDialog.show({
                      controller: 'DialogController',
                      templateUrl: 'confirm-dialog.html',
                      locals: {
                        displayOption: {
                          title: "หมายเลขรถตู้ไม่ถูกต้อง !",
                          content: "มีหมายเลขรถตู้นี้อยู่ในระบบแล้ว กรุณากรอกใหม่",
                          ok: "ตกลง"
                        }
                      }
                    });
                  }
                }, function(error) {
                  $mdDialog.show({
                    controller: 'DialogController',
                    templateUrl: 'confirm-dialog.html',
                    locals: {
                      displayOption: {
                        title: "เกิดข้อผิดพลาด !",
                        content: "เกิดข้อผิดพลาด btnEditVan ใน editVanController ระบบจะปิดอัตโนมัติ",
                        ok: "ตกลง"
                      }
                    }
                  }).then(function(response) {
                    ionic.Platform.exitApp();
                  });
                });
              });
            } else {
              $mdDialog.show({
                controller: 'DialogController',
                templateUrl: 'confirm-dialog.html',
                locals: {
                  displayOption: {
                    title: "หมายเลขรถตู้ไม่ถูกต้อง !",
                    content: "กรุณากรอกหมายเลขรถตู้",
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
                  title: "เบอร์โทรศัพท์ไม่ถูกต้อง !",
                  content: "เบอร์โทรศัพท์ต้องเป็นตัวเลขเท่านั้น",
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
                title: "เบอร์โทรศัพท์ไม่ถูกต้อง !",
                content: "กรุณากรอกเบอร์โทรศัพท์",
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
              title: "นามสกุลไม่ถูกต้อง !",
              content: "กรุณากรอกนามสกุล",
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
            title: "ชื่อจริงไม่ถูกต้อง !",
            content: "กรุณากรอกชื่อจริง",
            ok: "ตกลง"
          }
        }
      });
    }
  };
});
