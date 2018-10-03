appControllers.controller('cusBookingCtrl', function($scope, $state, $stateParams, $ionicHistory, $http, myService, $mdDialog, ionicDatePicker, ionicTimePicker) {
  $scope.booking = {};
  $scope.originProvinceValue = "selectOriginProvince";
  $scope.originDistrictValue = "selectOriginDistrict";
  $scope.destinationProvinceValue = "selectDestinationProvince";
  $scope.destinationDistrictValue = "selectDestinationDistrict";
  $scope.queueValue = "selectQueue";
  $scope.stopValue = "selectStop";
  $scope.getInValue = "selectGetIn";

  var fullDate = new Date();
  var day = fullDate.getDate();
  var month = fullDate.getMonth();
  var year = fullDate.getFullYear();
  var hour = fullDate.getHours();

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

  $http.get(myService.configAPI.webserviceURL + 'webservices/getProvinceList.php')
    .then(function(response) {
      $scope.originProvinceArrayList = response.data.results;
      $scope.destinationProvinceArrayList = response.data.results;
    // }, function(error) {
    //   $mdDialog.show({
    //     controller: 'DialogController',
    //     templateUrl: 'confirm-dialog.html',
    //     locals: {
    //       displayOption: {
    //         title: "เกิดข้อผิดพลาด !",
    //         content: "เกิดข้อผิดพลาด getProvinceList ใน cusBookingController ระบบจะปิดอัตโนมัติ",
    //         ok: "ตกลง"
    //       }
    //     }
    //   }).then(function(response) {
    //     ionic.Platform.exitApp();
    //   });
    });

  $scope.getOriginDistrict = function(province_id) {
    $scope.originProvinceValue = province_id;
    $scope.originDistrictValue = "selectOriginDistrict";
    $scope.queueArrayList = "";
    $scope.pointArrayList = "";
    $scope.bookingDetail = null;
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
              content: "เกิดข้อผิดพลาด getOriginDistrict ใน cusBookingController ระบบจะปิดอัตโนมัติ",
              ok: "ตกลง"
            }
          }
        }).then(function(response) {
          ionic.Platform.exitApp();
        });
      });
  };

  $scope.getDestinationDistrict = function(province_id) {
    $scope.destinationProvinceValue = province_id;
    $scope.destinationDistrictValue = "selectDestinationDistrict";
    $scope.queueArrayList = "";
    $scope.pointArrayList = "";
    $scope.bookingDetail = null;
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
              content: "เกิดข้อผิดพลาด getDestinationDistrict ใน cusBookingController ระบบจะปิดอัตโนมัติ",
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
                    content: "เกิดข้อผิดพลาด setOriginDistrict ใน cusBookingController ระบบจะปิดอัตโนมัติ",
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

  $scope.getQueueList = function(district_id) {
    $scope.destinationDistrictValue = district_id;
    $scope.pointArrayList = "";
    $scope.bookingDetail = null;
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
                    content: "เกิดข้อผิดพลาด getQueueList ใน cusBookingController ระบบจะปิดอัตโนมัติ",
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

  $scope.getPointList = function(queue_id) {
    $scope.queueValue = queue_id;
    $scope.pointArrayList = "";
    $http.get(myService.configAPI.webserviceURL + 'webservices/getPointList.php?queueid=' + queue_id)
      .then(function(response) {
        $scope.pointArrayList = response.data.results;
      }, function(error) {
        $mdDialog.show({
          controller: 'DialogController',
          templateUrl: 'confirm-dialog.html',
          locals: {
            displayOption: {
              title: "เกิดข้อผิดพลาด !",
              content: "เกิดข้อผิดพลาด getPointList ใน cusBookingController ระบบจะปิดอัตโนมัติ",
              ok: "ตกลง"
            }
          }
        }).then(function(response) {
          ionic.Platform.exitApp();
        });
      });
  };

  $scope.getBookingDetail = function(point_id) {
    $scope.stopValue = point_id;
    $http({
      url: myService.configAPI.webserviceURL + 'webservices/getBookingDetail.php',
      method: 'POST',
      data: {
        var_queueid: $scope.queueValue,
        var_pointid: $scope.stopValue
      }
    }).then(function(response) {
      $scope.bookingDetail = response.data.results[0];
      if ($scope.bookingDetail.point_price < 100) {
        $scope.bookingDetail.fee = 5;
        $scope.bookingDetail.total_price = parseInt($scope.bookingDetail.point_price) + 5;
      } else if ($scope.bookingDetail.point_price >= 100) {
        $scope.bookingDetail.fee = 10;
        $scope.bookingDetail.total_price = parseInt($scope.bookingDetail.point_price) + 10;
      }
    }, function(error) {
      $mdDialog.show({
        controller: 'DialogController',
        templateUrl: 'confirm-dialog.html',
        locals: {
          displayOption: {
            title: "เกิดข้อผิดพลาด !",
            content: "เกิดข้อผิดพลาด getBookingDetail ใน cusBookingController ระบบจะปิดอัตโนมัติ",
            ok: "ตกลง"
          }
        }
      }).then(function(response) {
        ionic.Platform.exitApp();
      });
    });
  };

  $scope.setGetIn = function(value) {
    $scope.getInValue = value;
  };

  var ipObj = {
    callback: function(val) { //Mandatory
      $scope.booking.date = new Date(val + 25200000).toISOString().slice(0, 10).replace('T', ' ');
    },
    from: new Date(year, month, day), //Optional
    to: new Date(2020, 10, 30), //Optional
    inputDate: new Date(), //Optional
    mondayFirst: true, //Optional
    closeOnSelect: false, //Optional
    templateType: 'popup' //Optional
  };

  $scope.openDatePickerStart = function() {
    ionicDatePicker.openDatePicker(ipObj);
  };

  var ipObj2 = {
    callback: function(val) { //Mandatory
      var selectedTime = new Date(val * 1000);
      var hourSelect = selectedTime.getUTCHours();
      if (selectedTime.getUTCHours() < 10) {
        if (selectedTime.getUTCMinutes() < 10) {
          $scope.booking.time = '0' + selectedTime.getUTCHours() + ':0' + selectedTime.getUTCMinutes();
        } else {
          $scope.booking.time = '0' + selectedTime.getUTCHours() + ':' + selectedTime.getUTCMinutes();
        }
      } else {
        if (selectedTime.getUTCMinutes() < 10) {
          $scope.booking.time = selectedTime.getUTCHours() + ':0' + selectedTime.getUTCMinutes();
        } else {
          $scope.booking.time = selectedTime.getUTCHours() + ':' + selectedTime.getUTCMinutes();
        }
      }
    },
    inputTime: hour * 3600, //Optional
    format: 24, //Optional
    step: 60, //Optional
    setLabel: 'Set' //Optional
  };

  $scope.openTimePickerStart = function() {
    ionicTimePicker.openTimePicker(ipObj2);
  };

  $scope.btnBooking = function() {
    if (typeof $scope.booking.date != 'undefined') {
      if (typeof $scope.booking.time != 'undefined') {
        if (hourSelect >= hour) {
          if ($scope.getInValue == 1) {
            $mdDialog.show({
              controller: 'DialogController',
              templateUrl: 'confirm-dialog.html',
              locals: {
                displayOption: {
                  title: "จอง ?",
                  content: "คุณแน่ใจที่จะจอง",
                  ok: "ตกลง",
                  cancel: "ยกเลิก"
                }
              }
            }).then(function(response) {
              $http({
                url: myService.configAPI.webserviceURL + 'webservices/booking.php',
                method: 'POST',
                data: {
                  var_status: 1,
                  var_fee: $scope.bookingDetail.fee,
                  var_total: $scope.bookingDetail.total_price,
                  var_memberid: myService.memberDetailFromLogin.member_id,
                  var_queueid: $scope.queueValue,
                  var_getintype: $scope.getInValue,
                  var_getinplace: "-",
                  var_pointid: $scope.stopValue,
                  var_date: $scope.booking.date,
                  var_time: $scope.booking.time,
                  var_vanid: "0"
                }
              }).then(function(response) {
                myService.bookingDetail.bookingID = response.data.results;
                $state.go('logincus.cusbookingsuccess');
              }, function(error) {
                $mdDialog.show({
                  controller: 'DialogController',
                  templateUrl: 'confirm-dialog.html',
                  locals: {
                    displayOption: {
                      title: "เกิดข้อผิดพลาด !",
                      content: "เกิดข้อผิดพลาด btnBooking ใน cusBookingController ระบบจะปิดอัตโนมัติ",
                      ok: "ตกลง"
                    }
                  }
                }).then(function(response) {
                  ionic.Platform.exitApp();
                });
              });
            });
          } else if ($scope.getInValue == 2) {
            if (($scope.booking.getinplace != null) && ($scope.booking.getinplace != "")) {
              $mdDialog.show({
                controller: 'DialogController',
                templateUrl: 'confirm-dialog.html',
                locals: {
                  displayOption: {
                    title: "จอง ?",
                    content: "คุณแน่ใจที่จะจอง",
                    ok: "ตกลง",
                    cancel: "ยกเลิก"
                  }
                }
              }).then(function(response) {
                $http({
                  url: myService.configAPI.webserviceURL + 'webservices/booking.php',
                  method: 'POST',
                  data: {
                    var_status: 1,
                    var_fee: $scope.bookingDetail.fee,
                    var_total: $scope.bookingDetail.total_price,
                    var_memberid: myService.memberDetailFromLogin.member_id,
                    var_queueid: $scope.queueValue,
                    var_getintype: $scope.getInValue,
                    var_getinplace: $scope.booking.getinplace,
                    var_pointid: $scope.stopValue,
                    var_date: $scope.booking.date,
                    var_time: $scope.booking.time,
                    var_vanid: "0"
                  }
                }).then(function(response) {
                  myService.bookingDetail.bookingID = response.data.results;
                  $state.go('logincus.cusbookingsuccess');
                }, function(error) {
                  $mdDialog.show({
                    controller: 'DialogController',
                    templateUrl: 'confirm-dialog.html',
                    locals: {
                      displayOption: {
                        title: "เกิดข้อผิดพลาด !",
                        content: "เกิดข้อผิดพลาด btnBooking ใน cusBookingController ระบบจะปิดอัตโนมัติ",
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
                    title: "สถานที่ขึ้นรถไม่ถูกต้อง !",
                    content: "กรุณากรอกสถานที่ขึ้นรถ",
                    ok: "ตกลง"
                  }
                }
              });
            }
          }
        } else {
          $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            locals: {
              displayOption: {
                title: "เวลาเดินทางไม่ถูกต้อง !",
                content: "กรุณาเลือกเวลาเดินทางให้มากกว่าเวลาปัจจุบัน",
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
              title: "เวลาเดินทางไม่ถูกต้อง !",
              content: "กรุณาเลือกเวลาเดินทาง",
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
            title: "วันเดินทางไม่ถูกต้อง !",
            content: "กรุณาเลือกวันเดินทาง",
            ok: "ตกลง"
          }
        }
      });
    }
  };
});
