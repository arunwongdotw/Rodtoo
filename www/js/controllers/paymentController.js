appControllers.controller('paymentCtrl', function($scope, $timeout, $state, $ionicHistory, $mdDialog, $http, myService, $mdSidenav, ionicDatePicker, ionicTimePicker, $cordovaFileTransfer, $cordovaCamera) {
  $scope.payment = {};

  var fullDate = new Date();
  var day = fullDate.getDate();
  var month = fullDate.getMonth();
  var year = fullDate.getFullYear();

  $http.get(myService.configAPI.webserviceURL + 'webservices/getBooking.php?bookingid=' + myService.bookingIDInList.booking_id)
    .then(function(response) {
      $scope.bookingDetail = response.data.results[0];
      $scope.payment.booking_id = $scope.bookingDetail.booking_id;
    }, function(error) {
      $mdDialog.show({
        controller: 'DialogController',
        templateUrl: 'confirm-dialog.html',
        locals: {
          displayOption: {
            title: "เกิดข้อผิดพลาด !",
            content: "เกิดข้อผิดพลาด getBooking ใน paymentController ระบบจะปิดอัตโนมัติ",
            ok: "ตกลง"
          }
        }
      }).then(function(response) {
        ionic.Platform.exitApp();
      });
    });

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
    $scope.navigateTo('logincus.cusbookinglist');
  };

  function checkImageURI(imageURI) {
    var str = imageURI;
    var res = str.match(/btnPaymentPickImage/g);
    if (res) {
      return "found";
    } else {
      return "notfound";
    }
  }

  $scope.btnPaymentPickImage = function() {
    var options = {
      quality: 100,
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 1000,
      targetHeight: 1000,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };
    $cordovaCamera.getPicture(options).then(function(imageURI) {
      var image = document.getElementById('payment-image');
      image.src = imageURI;
    });
  };

  var ipObj = {
    callback: function(val) {
      $scope.payment.date = new Date(val + 25200000).toISOString().slice(0, 10).replace('T', ' ');
    },
    from: new Date(year, month, day),
    to: new Date(2020, 10, 30),
    inputDate: new Date(),
    mondayFirst: true,
    closeOnSelect: false,
    templateType: 'popup'
  };

  $scope.openDatePickerStart = function() {
    ionicDatePicker.openDatePicker(ipObj);
  };

  var ipObj2 = {
    callback: function(val) {
      var selectedTime = new Date(val * 1000);
      if (selectedTime.getUTCHours() < 10) {
        if (selectedTime.getUTCMinutes() < 10) {
          $scope.payment.time = '0' + selectedTime.getUTCHours() + ':0' + selectedTime.getUTCMinutes();
        } else {
          $scope.payment.time = '0' + selectedTime.getUTCHours() + ':' + selectedTime.getUTCMinutes();
        }
      } else {
        if (selectedTime.getUTCMinutes() < 10) {
          $scope.payment.time = selectedTime.getUTCHours() + ':0' + selectedTime.getUTCMinutes();
        } else {
          $scope.payment.time = selectedTime.getUTCHours() + ':' + selectedTime.getUTCMinutes();
        }
      }
    },
    inputTime: 0,
    format: 24,
    step: 1,
    setLabel: 'Set'
  };

  $scope.openTimePickerStart = function() {
    ionicTimePicker.openTimePicker(ipObj2);
  };

  $scope.btnPayment = function() {
    if (($scope.payment.booking_id != null) && ($scope.payment.booking_id != "")) {
      if (($scope.payment.price != null) && ($scope.payment.price != "")) {
        if (typeof $scope.payment.date != 'undefined') {
          if (typeof $scope.payment.time != 'undefined') {
            $mdDialog.show({
              controller: 'DialogController',
              templateUrl: 'confirm-dialog.html',
              locals: {
                displayOption: {
                  title: "แจ้งชำระเงิน ?",
                  content: "คุณแน่ใจที่จะแจ้งชำระเงิน",
                  ok: "ตกลง",
                  cancel: "ยกเลิก"
                }
              }
            }).then(function(response) {
              var img = document.getElementById('payment-image');
              var imageURI = img.src;
              var server = myService.configAPI.webserviceURL + 'webservices/uploadSlipImage.php?memberid=' + myService.memberDetailFromLogin.member_id + '&bookingid=' + $scope.payment.booking_id;
              var trustHosts = true;
              var options2 = {
                fileKey: "myCameraImg",
                fileName: imageURI.substr(imageURI.lastIndexOf('/') + 1),
                mimeType: "image/jpeg",
                chunkedMode: false
              };
              var chkImageURI = checkImageURI(imageURI);
              if (chkImageURI == "found") {
                $http({
                  url: myService.configAPI.webserviceURL + 'webservices/payment.php',
                  method: 'POST',
                  data: {
                    var_bookingid: $scope.payment.booking_id,
                    var_price: $scope.payment.price,
                    var_img: "-",
                    var_date: $scope.payment.date,
                    var_time: $scope.payment.time,
                    var_status: "2"
                  }
                }).then(function(response) {
                  $mdDialog.show({
                    controller: 'DialogController',
                    templateUrl: 'confirm-dialog.html',
                    locals: {
                      displayOption: {
                        title: "แจ้งชำระเงินสำเร็จ !",
                        content: "คุณแจ้งชำระเงินสำเร็จ",
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
                        content: "เกิดข้อผิดพลาด btnPayment ใน paymentController ระบบจะปิดอัตโนมัติ",
                        ok: "ตกลง"
                      }
                    }
                  }).then(function(response) {
                    ionic.Platform.exitApp();
                  });
                });
              } else if (chkImageURI == "notfound") {
                $cordovaFileTransfer.upload(server, imageURI, options2)
                  .then(function(response) {
                    $scope.imgname = response.response;
                    $http({
                      url: myService.configAPI.webserviceURL + 'webservices/payment.php',
                      method: 'POST',
                      data: {
                        var_bookingid: $scope.payment.booking_id,
                        var_price: $scope.payment.price,
                        var_img: $scope.imgname,
                        var_date: $scope.payment.date,
                        var_time: $scope.payment.time,
                        var_status: "2"
                      }
                    }).then(function(response) {
                      $mdDialog.show({
                        controller: 'DialogController',
                        templateUrl: 'confirm-dialog.html',
                        locals: {
                          displayOption: {
                            title: "แจ้งชำระเงินสำเร็จ !",
                            content: "คุณแจ้งชำระเงินสำเร็จ",
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
                            content: "เกิดข้อผิดพลาด btnPayment ใน paymentController ระบบจะปิดอัตโนมัติ",
                            ok: "ตกลง"
                          }
                        }
                      }).then(function(response) {
                        ionic.Platform.exitApp();
                      });
                    });
                  }, function(error) {
                    $mdDialog.show({
                      controller: 'DialogController',
                      templateUrl: 'confirm-dialog.html',
                      locals: {
                        displayOption: {
                          title: "เกิดข้อผิดพลาด !",
                          content: "เกิดข้อผิดพลาด btnPayment ใน paymentController ระบบจะปิดอัตโนมัติ",
                          ok: "ตกลง"
                        }
                      }
                    }).then(function(response) {
                      ionic.Platform.exitApp();
                    });
                  });
              }
            });
          } else {
            $mdDialog.show({
              controller: 'DialogController',
              templateUrl: 'confirm-dialog.html',
              locals: {
                displayOption: {
                  title: "เวลาที่ชำระเงินไม่ถูกต้อง !",
                  content: "กรุณาเลือกเวลาที่ชำระเงิน",
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
                title: "วันชำระเงินไม่ถูกต้อง !",
                content: "กรุณาเลือกวันชำระเงิน",
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
            title: "หมายเลขการจองไม่ถูกต้อง !",
            content: "กรุณากรอกหมายเลขการจอง",
            ok: "ตกลง"
          }
        }
      });
    }
  };
});
