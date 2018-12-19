appControllers.controller('vanCtrl', function($scope, $timeout, $state, $stateParams, $ionicHistory, $http, myService, $mdDialog, $ionicNavBarDelegate, $ionicPlatform, $mdSidenav) {
  $scope.van = {};
  $scope.originProvinceValue = "selectOriginProvince";
  $scope.originDistrictValue = "selectOriginDistrict";
  $scope.destinationProvinceValue = "selectDestinationProvince";
  $scope.destinationDistrictValue = "selectDestinationDistrict";
  $scope.queueValue = "selectQueue";

  $scope.$on('$ionicView.enter', function(e) {
    $ionicNavBarDelegate.showBar(true);
  });

  $http.get(myService.configAPI.webserviceURL + 'webservices/getVanDetail2.php?memberid=' + myService.memberDetailFromLogin.member_id)
    .then(function(response) {
      if (response.data.results != null) {
        $scope.nullResponse = false;
        $scope.van.vanstatus = response.data.results[0].van_status;
        $scope.van.vanid = response.data.results[0].van_id;
        $scope.van.queueno = response.data.results[0].van_queue_no;
        $scope.van.plateno = response.data.results[0].van_plate_no;
        $scope.originProvinceValue = response.data.results[0].queue_origin_province_id;
        $scope.originDistrictValue = response.data.results[0].queue_origin_district_id;
        $scope.destinationProvinceValue = response.data.results[0].queue_destination_province_id;
        $scope.destinationDistrictValue = response.data.results[0].queue_destination_district_id;
        $scope.van.vanstatus = response.data.results[0].van_status;
        $scope.queueValue = response.data.results[0].queue_id;
        getOriginDistrictFromResponse($scope.originProvinceValue);
        getDestinationDistrictFromResponse($scope.destinationProvinceValue);
        getQueueFromResponse($scope.queueValue);
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
              content: "เกิดข้อผิดพลาด getOriginDistrictFromResponse ใน vanController ระบบจะปิดอัตโนมัติ",
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
              content: "เกิดข้อผิดพลาด getDestinationDistrictFromResponse ใน vanController ระบบจะปิดอัตโนมัติ",
              ok: "ตกลง"
            }
          }
        }).then(function(response) {
          ionic.Platform.exitApp();
        });
      });
  }

  function getQueueFromResponse(queue_id) {
    $http.get(myService.configAPI.webserviceURL + 'webservices/getQueueFromResponse.php?queueid=' + queue_id)
      .then(function(response) {
        $scope.queueArrayList = response.data.results;
      }, function(error) {
        $mdDialog.show({
          controller: 'DialogController',
          templateUrl: 'confirm-dialog.html',
          locals: {
            displayOption: {
              title: "เกิดข้อผิดพลาด !",
              content: "เกิดข้อผิดพลาด getQueueFromResponse ใน vanController ระบบจะปิดอัตโนมัติ",
              ok: "ตกลง"
            }
          }
        }).then(function(response) {
          ionic.Platform.exitApp();
        });
      });
  }

  $http.get(myService.configAPI.webserviceURL + 'webservices/getProvinceList.php')
    .then(function(response) {
      $scope.originProvinceArrayList = response.data.results;
      $scope.destinationProvinceArrayList = response.data.results;
    });

  $scope.setOriginProviceValue = function(value) {
    $scope.originProvinceValue = value;
    $scope.originDistrictValue = "selectOriginDistrict";
    $scope.originDistrictArrayList = "";
  };

  $scope.getOriginDistrict = function(province_id) {
    $scope.originProvinceValue = province_id;
    $scope.originDistrictValue = "selectOriginDistrict";
    $scope.queueValue = "selectQueue";
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
              content: "เกิดข้อผิดพลาด getOriginDistrict ใน vanController ระบบจะปิดอัตโนมัติ",
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
    $scope.queueValue = "selectQueue";
    if ($scope.originProvinceValue != "selectOriginProvince") {
      if ($scope.originDistrictValue != "selectOriginDistrict") {
        if ($scope.destinationProvinceValue != "selectDestinationProvince") {
          if ($scope.destinationDistrictValue != "selectDestinationDistrict") {
            $http({
              url: myService.configAPI.webserviceURL + 'webservices/getQueueList.php',
              method: 'POST',
              data: {
                var_originprovince: $scope.originProvinceValue,
                var_origindistrict: $scope.originDistrictValue,
                var_destinationprovince: $scope.destinationProvinceValue,
                var_destinationdistrict: $scope.destinationDistrictValue
              }
            }).then(function(response) {
              $scope.queueArrayList = response.data.results;
            }, function(error) {
              $mdDialog.show({
                controller: 'DialogController',
                templateUrl: 'confirm-dialog.html',
                locals: {
                  displayOption: {
                    title: "เกิดข้อผิดพลาด !",
                    content: "เกิดข้อผิดพลาด setOriginDistrict ใน vanController ระบบจะปิดอัตโนมัติ",
                    ok: "ตกลง"
                  }
                }
              }).then(function(response) {
                ionic.Platform.exitApp();
              });
            });
          }
        }
      }
    }
  };

  $scope.setOriginDistrictValue = function(value) {
    $scope.originDistrictValue = value;
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
              content: "เกิดข้อผิดพลาด getDestinationDistrict ใน vanController ระบบจะปิดอัตโนมัติ",
              ok: "ตกลง"
            }
          }
        }).then(function(response) {
          ionic.Platform.exitApp();
        });
      });
  };

  $scope.setDestinationProvinceValue = function(value) {
    $scope.destinationProvinceValue = value;
    $scope.destinationDistrictValue = "selectDestinationDistrict";
    $scope.destinationDistrictArrayList = "";
  };

  $scope.setDestinationDistrictValue = function(value) {
    $scope.destinationDistrictValue = value;
    $scope.queueValue = "selectQueue";
  };

  $scope.getQueueList = function(district_id) {
    $scope.destinationDistrictValue = district_id;
    $scope.queueValue = "selectQueue";
    if ($scope.originProvinceValue != "selectOriginProvince") {
      if ($scope.originDistrictValue != "selectOriginDistrict") {
        if ($scope.destinationProvinceValue != "selectDestinationProvince") {
          if ($scope.destinationDistrictValue != "selectDestinationDistrict") {
            $http({
              url: myService.configAPI.webserviceURL + 'webservices/getQueueList.php',
              method: 'POST',
              data: {
                var_originprovince: $scope.originProvinceValue,
                var_origindistrict: $scope.originDistrictValue,
                var_destinationprovince: $scope.destinationProvinceValue,
                var_destinationdistrict: $scope.destinationDistrictValue
              }
            }).then(function(response) {
              $scope.queueArrayList = response.data.results;
            }, function(error) {
              $mdDialog.show({
                controller: 'DialogController',
                templateUrl: 'confirm-dialog.html',
                locals: {
                  displayOption: {
                    title: "เกิดข้อผิดพลาด !",
                    content: "เกิดข้อผิดพลาด getQueueList ใน vanController ระบบจะปิดอัตโนมัติ",
                    ok: "ตกลง"
                  }
                }
              }).then(function(response) {
                ionic.Platform.exitApp();
              });
            });
          }
        }
      }
    }
  };

  $scope.setQueue = function(queue_id) {
    $scope.queueValue = queue_id;
  };

  $scope.setQueueValue = function(value) {
    $scope.queueValue = value;
  };

  $scope.btnAddVan = function() {
    if (($scope.van.queueno != null) && ($scope.van.queueno != "")) {
      if (($scope.van.plateno != null) && ($scope.van.plateno != "")) {
        if ($scope.queueValue != "selectQueue") {
          $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            locals: {
              displayOption: {
                title: "เพิ่มข้อมูลรถตู้ ?",
                content: "คุณแน่ใจที่จะเพิ่มข้อมูลรถตู้",
                ok: "ตกลง",
                cancel: "ยกเลิก"
              }
            }
          }).then(function(response) {
            $http({
              url: myService.configAPI.webserviceURL + 'webservices/checkQueueNo.php',
              method: 'POST',
              data: {
                var_queueno: $scope.van.queueno,
                var_queueid: $scope.queueValue
              }
            }).then(function(response) {
              $scope.response = response.data.results;
              if ($scope.response == 'checkQueueNo_notfound') {
                if ($scope.nullResponse == true) {
                  $http({
                    url: myService.configAPI.webserviceURL + 'webservices/insertVan.php',
                    method: 'POST',
                    data: {
                      var_memberid: myService.memberDetailFromLogin.member_id,
                      var_queueno: $scope.van.queueno,
                      var_plateno: $scope.van.plateno,
                      var_queueid: $scope.queueValue,
                      var_vanstatus: "1"
                    }
                  }).then(function(response) {
                    $mdDialog.show({
                      controller: 'DialogController',
                      templateUrl: 'confirm-dialog.html',
                      locals: {
                        displayOption: {
                          title: "เพิ่มข้อมูลรถตู้สำเร็จ !",
                          content: "คุณเพิ่มข้อมูลรถตู้สำเร็จ",
                          ok: "ตกลง"
                        }
                      }
                    }).then(function(response) {
                      $state.reload();
                    });
                  }, function(error) {
                    $mdDialog.show({
                      controller: 'DialogController',
                      templateUrl: 'confirm-dialog.html',
                      locals: {
                        displayOption: {
                          title: "เกิดข้อผิดพลาด !",
                          content: "เกิดข้อผิดพลาด btnAddVan ใน vanController ระบบจะปิดอัตโนมัติ",
                          ok: "ตกลง"
                        }
                      }
                    }).then(function(response) {
                      ionic.Platform.exitApp();
                    });
                  });
                } else if ($scope.nullResponse == false) {
                  $http({
                    url: myService.configAPI.webserviceURL + 'webservices/updateVan.php',
                    method: 'POST',
                    data: {
                      var_vanid: $scope.van.vanid,
                      var_queueno: $scope.van.queueno,
                      var_plateno: $scope.van.plateno,
                      var_queueid: $scope.queueValue
                    }
                  }).then(function(response) {
                    $mdDialog.show({
                      controller: 'DialogController',
                      templateUrl: 'confirm-dialog.html',
                      locals: {
                        displayOption: {
                          title: "เพิ่มข้อมูลรถตู้สำเร็จ !",
                          content: "คุณเพิ่มข้อมูลรถตู้สำเร็จ",
                          ok: "ตกลง"
                        }
                      }
                    }).then(function(response) {
                      $state.reload();
                    });
                  }, function(error) {
                    $mdDialog.show({
                      controller: 'DialogController',
                      templateUrl: 'confirm-dialog.html',
                      locals: {
                        displayOption: {
                          title: "เกิดข้อผิดพลาด !",
                          content: "เกิดข้อผิดพลาด btnAddVan ใน vanController ระบบจะปิดอัตโนมัติ",
                          ok: "ตกลง"
                        }
                      }
                    }).then(function(response) {
                      ionic.Platform.exitApp();
                    });
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
                    content: "เกิดข้อผิดพลาด btnAddVan ใน vanController ระบบจะปิดอัตโนมัติ",
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
                title: "คิวรถตู้ไม่ถูกต้อง !",
                content: "กรุณาเลือกคิวรถตู้",
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
              title: "ป้ายทะเบียนรถไม่ถูกต้อง !",
              content: "กรุณากรอกป้ายทะเบียนรถ",
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
            title: "หมายเลขรถตู้ไม่ถูกต้อง !",
            content: "กรุณากรอกหมายเลขรถตู้",
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
      if ($state.current.name == 'loginvan.van') {
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
