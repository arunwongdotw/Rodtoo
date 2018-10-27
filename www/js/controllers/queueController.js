appControllers.controller('queueCtrl', function($scope, $timeout, $state, $stateParams, $ionicHistory, $http, myService, $mdDialog, $ionicPlatform, $mdSidenav) {
  $scope.queue = {};
  $scope.originProvinceValue = "selectOriginProvince";
  $scope.originDistrictValue = "selectOriginDistrict";
  $scope.destinationProvinceValue = "selectDestinationProvince";
  $scope.destinationDistrictValue = "selectDestinationDistrict";

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

  $http.get(myService.configAPI.webserviceURL + 'webservices/getProvinceList.php')
    .then(function(response) {
      $scope.originProvinceArrayList = response.data.results;
      $scope.destinationProvinceArrayList = response.data.results;
    });

  $http.get(myService.configAPI.webserviceURL + 'webservices/getQueueDetail.php?memberid=' + myService.memberDetailFromLogin.member_id)
    .then(function(response) {
      if (response.data.results != null) {
        $scope.nullResponse = false;
        $scope.queue.name = response.data.results[0].queue_name;
        $scope.originProvinceValue = response.data.results[0].queue_origin_province_id;
        $scope.originDistrictValue = response.data.results[0].queue_origin_district_id;
        $scope.destinationProvinceValue = response.data.results[0].queue_destination_province_id;
        $scope.destinationDistrictValue = response.data.results[0].queue_destination_district_id;
        // $scope.queue.bankname = response.data.results[0].queue_bank;
        // $scope.queue.bankno = response.data.results[0].queue_bank_no;
        // $scope.queue.bankowner = response.data.results[0].queue_bank_owner;
        getOriginDistrictFromResponse($scope.originProvinceValue);
        getDestinationDistrictFromResponse($scope.destinationProvinceValue);
      } else {
        $scope.nullResponse = true;
      }
    });

  function getOriginDistrictFromResponse(province_id) {
    $http.get(myService.configAPI.webserviceURL + 'webservices/getOriginDistrict.php?provinceid=' + province_id)
      .then(function(response) {
        $scope.originDistrictArrayList = response.data.results;
      }, function(error) {
        $mdDialog.show({
          controller: 'DialogController',
          templateUrl: 'confirm-dialog.html',
          locals: {
            displayOption: {
              title: "เกิดข้อผิดพลาด !",
              content: "เกิดข้อผิดพลาด getDistrictValueFromResponse ใน queueController ระบบจะปิดอัตโนมัติ",
              ok: "ตกลง"
            }
          }
        }).then(function(response) {
          ionic.Platform.exitApp();
        });
      });
  }

  function getDestinationDistrictFromResponse(province_id) {
    $http.get(myService.configAPI.webserviceURL + 'webservices/getDestinationDistrict.php?provinceid=' + province_id)
      .then(function(response) {
        $scope.destinationDistrictArrayList = response.data.results;
      }, function(error) {
        $mdDialog.show({
          controller: 'DialogController',
          templateUrl: 'confirm-dialog.html',
          locals: {
            displayOption: {
              title: "เกิดข้อผิดพลาด !",
              content: "เกิดข้อผิดพลาด getDestinationDistrictFromResponse ใน queueController ระบบจะปิดอัตโนมัติ",
              ok: "ตกลง"
            }
          }
        }).then(function(response) {
          ionic.Platform.exitApp();
        });
      });
  }

  $scope.getOriginDistrict = function(province_id) {
    $scope.originProvinceValue = province_id;
    $scope.originDistrictValue = "selectOriginDistrict";
    $http.get(myService.configAPI.webserviceURL + 'webservices/getOriginDistrict.php?provinceid=' + province_id)
      .then(function(response) {
        $scope.originDistrictArrayList = response.data.results;
      }, function(error) {
        $mdDialog.show({
          controller: 'DialogController',
          templateUrl: 'confirm-dialog.html',
          locals: {
            displayOption: {
              title: "เกิดข้อผิดพลาด !",
              content: "เกิดข้อผิดพลาด getOriginDistrict ใน queueController ระบบจะปิดอัตโนมัติ",
              ok: "ตกลง"
            }
          }
        }).then(function(response) {
          ionic.Platform.exitApp();
        });
      });
  };

  $scope.setOriginDistrict = function(district_id) {
    $scope.originDistrictValue = district_id;
  };

  $scope.getDestinationDistrict = function(province_id) {
    $scope.destinationProvinceValue = province_id;
    $scope.destinationDistrictValue = "selectDestinationDistrict";
    $http.get(myService.configAPI.webserviceURL + 'webservices/getDestinationDistrict.php?provinceid=' + province_id)
      .then(function(response) {
        $scope.destinationDistrictArrayList = response.data.results;
      }, function(error) {
        $mdDialog.show({
          controller: 'DialogController',
          templateUrl: 'confirm-dialog.html',
          locals: {
            displayOption: {
              title: "เกิดข้อผิดพลาด !",
              content: "เกิดข้อผิดพลาด getDestinationDistrict ใน queueController ระบบจะปิดอัตโนมัติ",
              ok: "ตกลง"
            }
          }
        }).then(function(response) {
          ionic.Platform.exitApp();
        });
      });
  };

  $scope.setDestinationDistrict = function(district_id) {
    $scope.destinationDistrictValue = district_id;
  };

  $scope.setOriginProviceValue = function(value) {
    $scope.originProvinceValue = value;
    $scope.originDistrictValue = "selectOriginDistrict";
    $scope.originDistrictArrayList = "";
  };

  $scope.setOriginDistrictValue = function(value) {
    $scope.originDistrictValue = value;
  };

  $scope.setDestinationProvinceValue = function(value) {
    $scope.destinationProvinceValue = value;
    $scope.destinationDistrictValue = "selectDestinationDistrict";
    $scope.destinationDistrictArrayList = "";
  };

  $scope.setDestinationDistrictValue = function(value) {
    $scope.destinationDistrictValue = value;
  };

  $scope.btnQueue = function() {
    if (($scope.queue.name != null) && ($scope.queue.name != "")) {
      if ($scope.originProvinceValue != "selectOriginProvince") {
        if ($scope.originDistrictValue != "selectOriginDistrict") {
          if ($scope.destinationProvinceValue != "selectDestinationProvince") {
            if ($scope.destinationDistrictValue != "selectDestinationDistrict") {
              // if (($scope.queue.bankname != null) && ($scope.queue.bankname != "")) {
              //   if (($scope.queue.bankno != null) && ($scope.queue.bankno != "")) {
              //     if (($scope.queue.bankowner != null) && ($scope.queue.bankowner != "")) {
                    $mdDialog.show({
                      controller: 'DialogController',
                      templateUrl: 'confirm-dialog.html',
                      locals: {
                        displayOption: {
                          title: "บันทึกข้อมูลรถตู้ ?",
                          content: "คุณแน่ใจที่จะบันทึกข้อมูลรถตู้",
                          ok: "ตกลง",
                          cancel: "ยกเลิก"
                        }
                      }
                    }).then(function(response) {
                      if ($scope.nullResponse == true) {
                        $http({
                          url: myService.configAPI.webserviceURL + 'webservices/insertQueue.php',
                          method: 'POST',
                          data: {
                            var_memberid: myService.memberDetailFromLogin.member_id,
                            var_name: $scope.queue.name,
                            var_originprovince: $scope.originProvinceValue,
                            var_origindistrict: $scope.originDistrictValue,
                            var_destinationprovince: $scope.destinationProvinceValue,
                            var_destinationdistrict: $scope.destinationDistrictValue,
                            var_bankname: "0",
                            var_bankno: "0",
                            var_bankowner: "0"
                            // var_bankname: $scope.queue.bankname,
                            // var_bankno: $scope.queue.bankno,
                            // var_bankowner: $scope.queue.bankowner
                          }
                        }).then(function(response) {
                          $mdDialog.show({
                            controller: 'DialogController',
                            templateUrl: 'confirm-dialog.html',
                            locals: {
                              displayOption: {
                                title: "บันทึกข้อมูลรถตู้สำเร็จ !",
                                content: "คุณบันทึกข้อมูลรถตู้สำเร็จ",
                                ok: "ตกลง"
                              }
                            }
                          }).then(function(response) {
                            $state.go('loginown.ownbookinglist');
                          });
                        }, function(error) {
                          $mdDialog.show({
                            controller: 'DialogController',
                            templateUrl: 'confirm-dialog.html',
                            locals: {
                              displayOption: {
                                title: "เกิดข้อผิดพลาด !",
                                content: "เกิดข้อผิดพลาด btnQueue ใน queueController ระบบจะปิดอัตโนมัติ",
                                ok: "ตกลง"
                              }
                            }
                          }).then(function(response) {
                            ionic.Platform.exitApp();
                          });
                        });
                      } else {
                        $http({
                          url: myService.configAPI.webserviceURL + 'webservices/updateQueue.php',
                          method: 'POST',
                          data: {
                            var_memberid: myService.memberDetailFromLogin.member_id,
                            var_name: $scope.queue.name,
                            var_originprovince: $scope.originProvinceValue,
                            var_origindistrict: $scope.originDistrictValue,
                            var_destinationprovince: $scope.destinationProvinceValue,
                            var_destinationdistrict: $scope.destinationDistrictValue,
                            var_bankname: "0",
                            var_bankno: "0",
                            var_bankowner: "0"
                            // var_bankname: $scope.queue.bankname,
                            // var_bankno: $scope.queue.bankno,
                            // var_bankowner: $scope.queue.bankowner
                          }
                        }).then(function(response) {
                          $mdDialog.show({
                            controller: 'DialogController',
                            templateUrl: 'confirm-dialog.html',
                            locals: {
                              displayOption: {
                                title: "บันทึกข้อมูลรถตู้สำเร็จ !",
                                content: "คุณบันทึกข้อมูลรถตู้สำเร็จ",
                                ok: "ตกลง"
                              }
                            }
                          }).then(function(response) {
                            $state.go('loginown.ownbookinglist');
                          });
                        }, function(error) {
                          $mdDialog.show({
                            controller: 'DialogController',
                            templateUrl: 'confirm-dialog.html',
                            locals: {
                              displayOption: {
                                title: "เกิดข้อผิดพลาด !",
                                content: "เกิดข้อผิดพลาด btnQueue ใน queueController ระบบจะปิดอัตโนมัติ",
                                ok: "ตกลง"
                              }
                            }
                          }).then(function(response) {
                            ionic.Platform.exitApp();
                          });
                        });
                      }
                    });
              //     } else {
              //       $mdDialog.show({
              //         controller: 'DialogController',
              //         templateUrl: 'confirm-dialog.html',
              //         locals: {
              //           displayOption: {
              //             title: "ชื่อเจ้าของบัญชีไม่ถูกต้อง !",
              //             content: "กรุณากรอกชื่อเจ้าของบัญชี",
              //             ok: "ตกลง"
              //           }
              //         }
              //       });
              //     }
              //   } else {
              //     $mdDialog.show({
              //       controller: 'DialogController',
              //       templateUrl: 'confirm-dialog.html',
              //       locals: {
              //         displayOption: {
              //           title: "หมายเลขบัญชีไม่ถูกต้อง !",
              //           content: "กรุณากรอกหมายเลขบัญชี",
              //           ok: "ตกลง"
              //         }
              //       }
              //     });
              //   }
              // } else {
              //   $mdDialog.show({
              //     controller: 'DialogController',
              //     templateUrl: 'confirm-dialog.html',
              //     locals: {
              //       displayOption: {
              //         title: "ชื่อธนาคารไม่ถูกต้อง !",
              //         content: "กรุณากรอกชื่อธนาคาร",
              //         ok: "ตกลง"
              //       }
              //     }
              //   });
              // }
            } else {
              $mdDialog.show({
                controller: 'DialogController',
                templateUrl: 'confirm-dialog.html',
                locals: {
                  displayOption: {
                    title: "อำเภอปลายทางไม่ถูกต้อง !",
                    content: "กรุณาเลือกอำเภอปลายทาง",
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
                  title: "จังหวัดปลายทางไม่ถูกต้อง !",
                  content: "กรุณาเลือกจังหวัดปลายทาง",
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
                title: "อำเภอต้นทางไม่ถูกต้อง !",
                content: "กรุณาเลือกอำเภอต้นทาง",
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
              title: "จังหวัดต้นทางไม่ถูกต้อง !",
              content: "กรุณาเลือกจังหวัดต้นทาง",
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
            title: "ชื่อคิวรถตู้ไม่ถูกต้อง !",
            content: "กรุณากรอกชื่อคิวรถตู้",
            ok: "ตกลง"
          }
        }
      });
    }
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
      if ($state.current.name == 'loginown.queue') {
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
