appControllers.controller('cusBookingCtrl', function($scope, $state, $stateParams, $ionicHistory, $http, myService, $mdDialog, ionicDatePicker, ionicTimePicker) {
  $scope.booking = {};
  $scope.originProvinceValue = "selectOriginProvince";
  $scope.originDistrictValue = "selectOriginDistrict";
  $scope.destinationProvinceValue = "selectDestinationProvince";
  $scope.destinationDistrictValue = "selectDestinationDistrict";
  $scope.queueValue = "selectQueue";
  $scope.stopValue = "selectStop";
  $scope.getInValue = "selectGetIn";
  $scope.getInPlaceValue = "selectGetInPlace";

  var hourSelect;
  var fullDate = new Date();
  var day = fullDate.getDate();
  var month = fullDate.getMonth();
  var year = fullDate.getFullYear();
  var hour = fullDate.getHours();
  var fullDateWithoutTime = new Date().toISOString().slice(0, 10).replace('T', ' ');

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
    $scope.queueValue = "selectQueue";
    $scope.getInValue = "selectGetIn";
    $scope.queueArrayList = "";
    $scope.pointArrayList = "";
    $scope.bookingDetail = null;
    delete $scope.booking.date;
    delete $scope.booking.time;
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
    $scope.queueValue = "selectQueue";
    $scope.getInValue = "selectGetIn";
    $scope.queueArrayList = "";
    $scope.pointArrayList = "";
    $scope.bookingDetail = null;
    delete $scope.booking.date;
    delete $scope.booking.time;
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
    $scope.getInValue = "selectGetIn";
    delete $scope.booking.date;
    delete $scope.booking.time;
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
    $scope.queueValue = "selectQueue";
  };

  $scope.setQueueValue = function(value) {
    $scope.queueValue = value;
    $scope.getInValue = "selectGetIn";
    $scope.stopValue = "selectStop";
    $scope.pointArrayList = "";
    delete $scope.booking.date;
    delete $scope.booking.time;
  };

  $scope.setGetIn = function(getin_value) {
    $scope.getInValue = getin_value;
  };

  $scope.setGetInValue = function(value) {
    $scope.getInValue = value;
    $scope.getInPlaceValue = 'selectGetInPlace';
  };

  $scope.setGetInPlace = function(getin_id) {
    $scope.getInPlaceValue = getin_id;
  };

  $scope.setStopValue = function(value) {
    $scope.stopValue = value;
  };

  $scope.setGetInPlaceValue = function(value) {
    $scope.getInPlaceValue = value;
  };

  $scope.getQueueList = function(district_id) {
    $scope.destinationDistrictValue = district_id;
    $scope.queueValue = "selectQueue";
    $scope.getInValue = "selectGetIn";
    $scope.pointArrayList = "";
    $scope.bookingDetail = null;
    delete $scope.booking.date;
    delete $scope.booking.time;
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
    $http.get(myService.configAPI.webserviceURL + 'webservices/getGetInList.php?queueid=' + queue_id)
      .then(function(response) {
        $scope.getInArrayList = response.data.results;
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
      hourSelect = selectedTime.getUTCHours();
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
    inputTime: (hour * 3600) + 3600, //Optional
    format: 24, //Optional
    step: 60, //Optional
    setLabel: 'Set' //Optional
  };

  $scope.openTimePickerStart = function() {
    ionicTimePicker.openTimePicker(ipObj2);
  };

  $scope.btnBooking = function() {
    console.log($scope.originProvinceValue);
    console.log($scope.originDistrictValue);
    console.log($scope.destinationProvinceValue);
    console.log($scope.destinationDistrictValue);
    console.log($scope.queueValue);
    console.log($scope.getInValue);
    console.log($scope.getInPlaceValue);
    console.log($scope.booking.date);
    console.log($scope.booking.time);
    if (typeof $scope.booking.date != 'undefined') {
      if (typeof $scope.booking.time != 'undefined') {
        if ((hourSelect > hour) && ($scope.booking.date >= fullDateWithoutTime)) {
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
                  var_getinid: "-",
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
            if ($scope.getInPlaceValue != "selectGetInPlace") {
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
                    var_getinid: $scope.getInPlaceValue,
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
                    title: "สถานที่ขึ้นรถตู้ไม่ถูกต้อง !",
                    content: "กรุณาเลือกสถานที่ขึ้นรถตู้",
                    ok: "ตกลง"
                  }
                }
              });
            }
          } else if ($scope.getInValue == 3) {
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
                    var_getinid: "-",
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
          } else {
            $mdDialog.show({
              controller: 'DialogController',
              templateUrl: 'confirm-dialog.html',
              locals: {
                displayOption: {
                  title: "จุดขึ้นรถตู้ไม่ถูกต้อง !",
                  content: "กรุณาเลือกจุดขึ้นรถตู้",
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
