appControllers.controller('postponeCtrl', function($scope, $state, $stateParams, $ionicHistory, $http, myService, $mdDialog, ionicDatePicker, ionicTimePicker, $timeout, $mdSidenav) {
  $scope.booking = {};
  var selectHour;
  var fullDate = new Date();
  var day = fullDate.getDate();
  var month = fullDate.getMonth();
  var year = fullDate.getFullYear();
  var curHour = fullDate.getHours();
  var fullDateWithoutTime = new Date().toISOString().slice(0, 10).replace('T', ' ');

  $http.get(myService.configAPI.webserviceURL + 'webservices/getBookingDetail.php?bookingid=' + myService.bookingIDInList.booking_id)
    .then(function(response) {
      $scope.booking.date = response.data.results[0].booking_boarding_date;
      $scope.booking.time = response.data.results[0].booking_boarding_time;
    }, function(error) {
      $mdDialog.show({
        controller: 'DialogController',
        templateUrl: 'confirm-dialog.html',
        locals: {
          displayOption: {
            title: "เกิดข้อผิดพลาด !",
            content: "เกิดข้อผิดพลาด getBookingDetail ใน postponeController ระบบจะปิดอัตโนมัติ",
            ok: "ตกลง"
          }
        }
      }).then(function(response) {
        ionic.Platform.exitApp();
      });
    });

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
    },
    inputTime: (curHour * 3600) + 3600, //Optional
    format: 24, //Optional
    step: 60, //Optional
    setLabel: 'Set' //Optional
  };

  $scope.openTimePickerStart = function() {
    ionicTimePicker.openTimePicker(ipObj2);
  };

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

  $scope.btnPostpone = function() {
    if (typeof $scope.booking.date != 'undefined') {
      if (typeof $scope.booking.time != 'undefined') {
        checkDateTime(function(status) {
          if ($scope.checkDateTime == true) {
            $mdDialog.show({
              controller: 'DialogController',
              templateUrl: 'confirm-dialog.html',
              locals: {
                displayOption: {
                  title: "เลื่อนเที่ยวรถตู้ ?",
                  content: "คุณแน่ใจที่จะเลื่อนเที่ยวรถตู้",
                  ok: "ตกลง",
                  cancel: "ยกเลิก"
                }
              }
            }).then(function(response) {
              $http({
                url: myService.configAPI.webserviceURL + 'webservices/postpone.php',
                method: 'POST',
                data: {
                  var_bookingid: myService.bookingIDInList.booking_id,
                  var_date: $scope.booking.date,
                  var_time: $scope.booking.time
                }
              }).then(function(response) {
                $mdDialog.show({
                  controller: 'DialogController',
                  templateUrl: 'confirm-dialog.html',
                  locals: {
                    displayOption: {
                      title: "เลื่อนเที่ยวรถตู้สำเร็จ !",
                      content: "คุณเลื่อนเที่ยวรถตู้สำเร็จ",
                      ok: "ตกลง"
                    }
                  }
                }).then(function(response) {
                  $state.go('logincus.cusbookinglist');
                });
              }, function(error) {
                $mdDialog.show({
                  controller: 'DialogController',
                  templateUrl: 'confirm-dialog.html',
                  locals: {
                    displayOption: {
                      title: "เกิดข้อผิดพลาด !",
                      content: "เกิดข้อผิดพลาด btnPostpone ใน postponeController ระบบจะปิดอัตโนมัติ",
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
