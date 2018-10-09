appControllers.controller('cusProfileCtrl', function($scope, $timeout, $state, $ionicHistory, $mdDialog, $http, myService, $mdSidenav, $cordovaFileTransfer, $cordovaCamera) {
  $scope.cus = {};
  $scope.randomNumber = Math.random();
  $scope.cus.profileImg = 'http://1did.net/rodtoo/img/img_profile/' + myService.memberDetailFromLogin.member_username + '.jpg?random=' + $scope.randomNumber;
  $scope.cus.firstname = myService.memberDetailFromLogin.member_firstname;
  $scope.cus.lastname = myService.memberDetailFromLogin.member_lastname;
  $scope.addressValue = myService.memberDetailFromLogin.member_province_id;
  $scope.cus.phone = myService.memberDetailFromLogin.member_phone;
  $scope.cus.email = myService.memberDetailFromLogin.member_email;
  $scope.cus.username = myService.memberDetailFromLogin.member_username;
  $scope.cus.memberid = myService.memberDetailFromLogin.member_id;

  $http.get(myService.configAPI.webserviceURL + 'webservices/getProvinceList.php')
    .then(function(response) {
      $scope.provinceArrayList = response.data.results;
    }, function(error) {
      $mdDialog.show({
        controller: 'DialogController',
        templateUrl: 'confirm-dialog.html',
        locals: {
          displayOption: {
            title: "เกิดข้อผิดพลาด !",
            content: "เกิดข้อผิดพลาด getProvinceList ใน cusProfileController ระบบจะปิดอัตโนมัติ",
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

  $scope.setAddressValue = function(province_id) {
    $scope.addressValue = province_id;
  };

  $scope.btnSignUpPickImage = function() {
    var options = {
      quality: 100,
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 800,
      targetHeight: 800,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };
    $cordovaCamera.getPicture(options).then(function(imageURI) {
      var image = document.getElementById('sign-up-image');
      image.src = imageURI;
    });
  };

  function checkImageURI(imageURI) {
    var str = imageURI;
    var res = str.match(/1did/g);
    if (res) {
      return "found";
    } else {
      return "notfound";
    }
  }

  $scope.btnUpdate = function() {
    var checkNumberRegEx = /^[0-9]+$/;
    if (($scope.cus.firstname != null) && ($scope.cus.firstname != "")) {
      if (($scope.cus.lastname != null) && ($scope.cus.lastname != "")) {
        if (($scope.cus.phone != null) && ($scope.cus.phone != "")) {
          if (checkNumberRegEx.test($scope.cus.phone)) {
            if (($scope.cus.email != null) && ($scope.cus.email != "")) {
              $mdDialog.show({
                controller: 'DialogController',
                templateUrl: 'confirm-dialog.html',
                locals: {
                  displayOption: {
                    title: "อัปเดตโปรไฟล์ ?",
                    content: "คุณแน่ใจที่จะอัปเดตโปรไฟล์",
                    ok: "ตกลง",
                    cancel: "ยกเลิก"
                  }
                }
              }).then(function(response) {
                var img = document.getElementById('sign-up-image');
                var imageURI = img.src;
                var server = myService.configAPI.webserviceURL + 'webservices/uploadSignUpImage.php?username=' + $scope.cus.username;
                var trustHosts = true;
                var options2 = {
                  fileKey: "myCameraImg",
                  fileName: imageURI.substr(imageURI.lastIndexOf('/') + 1),
                  mimeType: "image/jpeg",
                  chunkedMode: false
                };
                var check = checkImageURI(imageURI);
                if (check == "notfound") {
                  $cordovaFileTransfer.upload(server, imageURI, options2);
                }
                $http({
                  url: myService.configAPI.webserviceURL + 'webservices/updateProfile.php',
                  method: 'POST',
                  data: {
                    var_memberid: $scope.cus.memberid,
                    var_firstname: $scope.cus.firstname,
                    var_lastname: $scope.cus.lastname,
                    var_provinceid: $scope.addressValue,
                    var_phone: $scope.cus.phone,
                    var_email: $scope.cus.email
                  }
                }).then(function(response) {
                  myService.memberDetailFromLogin = response.data.results[0];
                  $mdDialog.show({
                    controller: 'DialogController',
                    templateUrl: 'confirm-dialog.html',
                    locals: {
                      displayOption: {
                        title: "แก้ไขโปรไฟล์สำเร็จ !",
                        content: "คุณแก้ไขโปรไฟล์สำเร็จ",
                        ok: "ตกลง"
                      }
                    }
                  }).then(function(response) {
                    $state.go('logincus.cusbooking');
                  });
                }, function(error) {
                  $mdDialog.show({
                    controller: 'DialogController',
                    templateUrl: 'confirm-dialog.html',
                    locals: {
                      displayOption: {
                        title: "เกิดข้อผิดพลาด !",
                        content: "เกิดข้อผิดพลาด btnUpdate ใน cusProfileController ระบบจะปิดอัตโนมัติ",
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
                    title: "อีเมลไม่ถูกต้อง !",
                    content: "กรุณากรอกอีเมล",
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
                  title: "เบอร์โทรศัพท์ที่ติดต่อได้ไม่ถูกต้อง !",
                  content: "เบอร์โทรศัพท์ที่ติดต่อได้ ต้องเป็นตัวเลขเท่านั้น",
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
                title: "เบอร์โทรศัพท์ที่ติดต่อได้ไม่ถูกต้อง !",
                content: "กรุณาเบอร์โทรศัพท์ที่ติดต่อได้",
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
