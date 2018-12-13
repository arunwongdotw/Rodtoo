appControllers.controller('cusBookingCtrl', function($scope, $state, $stateParams, $ionicHistory, $http, myService, $mdDialog, ionicDatePicker, ionicTimePicker, $ionicPlatform, $mdSidenav) {
  $scope.booking = {};
  $scope.originProvinceValue = "selectOriginProvince";
  $scope.originDistrictValue = "selectOriginDistrict";
  $scope.destinationProvinceValue = "selectDestinationProvince";
  $scope.destinationDistrictValue = "selectDestinationDistrict";
  $scope.queueValue = "selectQueue";
  $scope.stopValue = "selectStop";
  $scope.getInValue = "selectGetIn";
  $scope.getInPlaceValue = "selectGetInPlace";
  $scope.seatValue = "selectSeat";

  var selectHour;
  var fullDate = new Date();
  var day = fullDate.getDate();
  var month = fullDate.getMonth();
  var year = fullDate.getFullYear();
  var curHour = fullDate.getHours();
  var fullDateWithoutTime = new Date().toISOString().slice(0, 10).replace('T', ' ');

  $http.get(myService.configAPI.webserviceURL + 'webservices/getProvinceList.php')
    .then(function(response) {
      $scope.originProvinceArrayList = response.data.results;
      $scope.destinationProvinceArrayList = response.data.results;
    });

  $scope.getOriginDistrict = function(province_id) {
    $scope.originProvinceValue = province_id;
    $scope.originDistrictValue = "selectOriginDistrict";
    $scope.queueValue = "selectQueue";
    $scope.getInValue = "selectGetIn";
    $scope.seatValue = "selectSeat";
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
    $scope.seatValue = "selectSeat";
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
    $scope.stopValue = "selectStop";
    $scope.seatValue = "selectSeat";
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
    $scope.seatValue = "selectSeat";
    $scope.pointArrayList = "";
    delete $scope.booking.date;
    delete $scope.booking.time;
  };

  $scope.setGetIn = function(getin_value) {
    $scope.getInValue = getin_value;
    $scope.getInPlaceValue = 'selectGetInPlace';
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
    $scope.seatValue = 'selectSeat';
  };

  $scope.setStop = function(point_id) {
    $scope.stopValue = point_id;
    $scope.seatValue = 'selectSeat';
  };

  $scope.setGetInPlaceValue = function(value) {
    $scope.getInPlaceValue = value;
  };

  $scope.setSeatValue = function(value) {
    $scope.seatValue = value;
  };

  $scope.setSeat = function(value) {
    $scope.seatValue = value;
  };

  $scope.getQueueList = function(district_id) {
    $scope.destinationDistrictValue = district_id;
    $scope.queueValue = "selectQueue";
    $scope.getInValue = "selectGetIn";
    $scope.stopValue = "selectStop";
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
    $http.get(myService.configAPI.webserviceURL + 'webservices/getQueueFirstLastTime.php?queueid=' + queue_id)
      .then(function(response) {
        $scope.queueFirstLast = response.data.results[0];
      }, function(error) {
        $mdDialog.show({
          controller: 'DialogController',
          templateUrl: 'confirm-dialog.html',
          locals: {
            displayOption: {
              title: "เกิดข้อผิดพลาด !",
              content: "เกิดข้อผิดพลาด getQueueFirstLastTime ใน cusBookingController ระบบจะปิดอัตโนมัติ",
              ok: "ตกลง"
            }
          }
        }).then(function(response) {
          ionic.Platform.exitApp();
        });
      });
  };

  $scope.getPrice = function(seat) {
    $scope.seatValue = seat;
    $http({
      url: myService.configAPI.webserviceURL + 'webservices/getPrice.php',
      method: 'POST',
      data: {
        var_queueid: $scope.queueValue,
        var_pointid: $scope.stopValue
      }
    }).then(function(response) {
      if (response.data.response == "getPrice_isFree") {
        $scope.bookingDetail = response.data.results[0];
        $scope.bookingDetail.point_price = $scope.bookingDetail.point_price * $scope.seatValue;
        $scope.bookingDetail.fee = 0;
        $scope.bookingDetail.total_price = parseInt($scope.bookingDetail.point_price) + 0;
      } else if (response.data.response == "getPrice_notFree") {
        $scope.bookingDetail = response.data.results[0];
        if ($scope.seatValue > 1) {
          $scope.bookingDetail.point_price = $scope.bookingDetail.point_price * $scope.seatValue;
          $scope.bookingDetail.fee = $scope.bookingDetail.queue_fee_morethan_hundred;
          $scope.bookingDetail.total_price = parseInt($scope.bookingDetail.point_price) + parseInt($scope.bookingDetail.fee);
        } else {
          if ($scope.bookingDetail.point_price < 100) {
            $scope.bookingDetail.fee = $scope.bookingDetail.queue_fee_lessthan_hundred;
            $scope.bookingDetail.total_price = parseInt($scope.bookingDetail.point_price) + parseInt($scope.bookingDetail.fee);
          } else if ($scope.bookingDetail.point_price >= 100) {
            $scope.bookingDetail.fee = $scope.bookingDetail.queue_fee_morethan_hundred;
            $scope.bookingDetail.total_price = parseInt($scope.bookingDetail.point_price) + parseInt($scope.bookingDetail.fee);
          }
        }
      }
    }, function(error) {
      $mdDialog.show({
        controller: 'DialogController',
        templateUrl: 'confirm-dialog.html',
        locals: {
          displayOption: {
            title: "เกิดข้อผิดพลาด !",
            content: "เกิดข้อผิดพลาด getPrice ใน cusBookingController ระบบจะปิดอัตโนมัติ",
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
      selectHour = selectedTime.getUTCHours();
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
      countVanRound(function(status) {});
    },
    inputTime: (curHour * 3600) + 3600, //Optional
    format: 24, //Optional
    step: 60, //Optional
    setLabel: 'Set' //Optional
  };

  $scope.openTimePickerStart = function() {
    delete $scope.booking.time;
    ionicTimePicker.openTimePicker(ipObj2);
  };

  function countVanRound(callback) {
    $http({
      url: myService.configAPI.webserviceURL + 'webservices/countVanRound.php',
      method: 'POST',
      data: {
        var_queueid: $scope.queueValue,
        var_date: $scope.booking.date,
        var_time: $scope.booking.time + ':00',
      }
    }).then(function(response) {
      console.log(response);
      $scope.countSeat = response.data.results[0].countRow;
      $scope.remainSeat = 13 - $scope.countSeat;
      callback();
    }, function(error) {
      $mdDialog.show({
        controller: 'DialogController',
        templateUrl: 'confirm-dialog.html',
        locals: {
          displayOption: {
            title: "เกิดข้อผิดพลาด !",
            content: "เกิดข้อผิดพลาด countVanRound ใน cusBookingController ระบบจะปิดอัตโนมัติ",
            ok: "ตกลง"
          }
        }
      }).then(function(response) {
        ionic.Platform.exitApp();
      });
    });
  }

  function checkDateTime(callback) {
    var selectDatetime = $scope.booking.date + " " + $scope.booking.time;
    var fullSelectDate = new Date(selectDatetime);
    var fullCurDate = new Date();
    var timeDiff = Math.abs(fullSelectDate.getTime() - fullCurDate.getTime());
    var hoursDiff = timeDiff / 3600000;
    if (hoursDiff >= 2) {
      $scope.checkDateTime = true;
      callback();
    } else {
      $scope.checkDateTime = false;
      callback();
    }
  }

  $scope.btnBooking = function() {
    $scope.booking.time = $scope.booking.time + ':00';
    if (typeof $scope.booking.date != 'undefined') {
      if (typeof $scope.booking.time != 'undefined') {
        if (($scope.booking.time >= $scope.bookingDetail.queue_first_time) && ($scope.booking.time <= $scope.bookingDetail.queue_last_time)) {
          if ($scope.seatValue < $scope.remainSeat) {
            checkDateTime(function(status) {
              if ($scope.checkDateTime == true) {
                if ($scope.getInValue == 1) {
                  $mdDialog.show({
                    controller: 'DialogController',
                    templateUrl: 'confirm-dialog.html',
                    locals: {
                      displayOption: {
                        title: "จองรถตู้ ?",
                        content: "คุณแน่ใจที่จะจองรถตู้",
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
                        var_seat: $scope.seatValue,
                        var_originprovince: $scope.originProvinceValue,
                        var_origindistrict: $scope.originDistrictValue,
                        var_destinationprovince: $scope.destinationProvinceValue,
                        var_destinationdistrict: $scope.destinationDistrictValue,
                        var_memberid: myService.memberDetailFromLogin.member_id,
                        var_queueid: $scope.queueValue,
                        var_getintype: $scope.getInValue,
                        var_getinplace: "-",
                        var_getinid: "-",
                        var_pointid: $scope.stopValue,
                        var_date: $scope.booking.date,
                        var_time: $scope.booking.time,
                        var_vanid: "0",
                        var_postpone: "0"
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
                          title: "จองรถตู้ ?",
                          content: "คุณแน่ใจที่จะจองรถตู้",
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
                          var_seat: $scope.seatValue,
                          var_originprovince: $scope.originProvinceValue,
                          var_origindistrict: $scope.originDistrictValue,
                          var_destinationprovince: $scope.destinationProvinceValue,
                          var_destinationdistrict: $scope.destinationDistrictValue,
                          var_memberid: myService.memberDetailFromLogin.member_id,
                          var_queueid: $scope.queueValue,
                          var_getintype: $scope.getInValue,
                          var_getinplace: "-",
                          var_getinid: $scope.getInPlaceValue,
                          var_pointid: $scope.stopValue,
                          var_date: $scope.booking.date,
                          var_time: $scope.booking.time,
                          var_vanid: "0",
                          var_postpone: "0"
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
                          title: "จองรถตู้ ?",
                          content: "คุณแน่ใจที่จะจองรถตู้",
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
                          var_seat: $scope.seatValue,
                          var_originprovince: $scope.originProvinceValue,
                          var_origindistrict: $scope.originDistrictValue,
                          var_destinationprovince: $scope.destinationProvinceValue,
                          var_destinationdistrict: $scope.destinationDistrictValue,
                          var_memberid: myService.memberDetailFromLogin.member_id,
                          var_queueid: $scope.queueValue,
                          var_getintype: $scope.getInValue,
                          var_getinplace: $scope.booking.getinplace,
                          var_getinid: "-",
                          var_pointid: $scope.stopValue,
                          var_date: $scope.booking.date,
                          var_time: $scope.booking.time,
                          var_vanid: "0",
                          var_postpone: "0"
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
                      title: "เวลาขึ้นรถตู้ไม่ถูกต้อง !",
                      content: "กรุณาจองรถตู้ก่อนเวลาเดินทางอย่างน้อย 2 ชั่วโมง",
                      ok: "ตกลง"
                    }
                  }
                });
              }
            });
          } else {
            $mdDialog.show({
              controller: 'DialogController',
              templateUrl: 'confirm-dialog.html',
              locals: {
                displayOption: {
                  title: "จำนวนที่นั่งไม่ถูกต้อง !",
                  content: "กรุณาเลือกจำนวนที่นั่งใหม่ เพราะจำนวนที่นั่งที่จองมากกว่าจำนวนที่นั่งคงเหลือ",
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
                content: "รถตู้ออกเดินทางเที่ยวแรก " + $scope.bookingDetail.queue_first_time + " และเที่ยวสุดท้าย " + $scope.bookingDetail.queue_last_time,
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
      if ($state.current.name == 'logincus.cusbooking') {
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
