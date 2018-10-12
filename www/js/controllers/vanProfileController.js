appControllers.controller('vanProfileCtrl', function($scope, $timeout, $state, $ionicHistory, $mdDialog, $http, myService, $mdSidenav, $cordovaFileTransfer, $cordovaCamera) {
  $scope.van = {};
  $scope.randomNumber = Math.random();
  $scope.van.profileImg = 'http://1did.net/rodtoo/img/img_profile/' + myService.memberDetailFromLogin.member_username + '.jpg?random=' + $scope.randomNumber;
  $scope.van.firstname = myService.memberDetailFromLogin.member_firstname;
  $scope.van.lastname = myService.memberDetailFromLogin.member_lastname;
  $scope.addressValue = myService.memberDetailFromLogin.member_province_id;
  $scope.van.phone = myService.memberDetailFromLogin.member_phone;
  $scope.van.email = myService.memberDetailFromLogin.member_email;
  $scope.van.username = myService.memberDetailFromLogin.member_username;
  $scope.van.memberid = myService.memberDetailFromLogin.member_id;

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
            content: "เกิดข้อผิดพลาด getProvinceList ใน vanProfileController ระบบจะปิดอัตโนมัติ",
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
    if (($scope.van.firstname != null) && ($scope.van.firstname != "")) {
      if (($scope.van.lastname != null) && ($scope.van.lastname != "")) {
        if (($scope.van.phone != null) && ($scope.van.phone != "")) {
          if (checkNumberRegEx.test($scope.van.phone)) {
            if (($scope.van.email != null) && ($scope.van.email != "")) {
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
                var server = myService.configAPI.webserviceURL + 'webservices/uploadSignUpImage.php?username=' + $scope.van.username;
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
                    var_memberid: $scope.van.memberid,
                    var_firstname: $scope.van.firstname,
                    var_lastname: $scope.van.lastname,
                    var_provinceid: $scope.addressValue,
                    var_phone: $scope.van.phone,
                    var_email: $scope.van.email
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
                    $state.go('loginvan.van');
                  });
                }, function(error) {
                  $mdDialog.show({
                    controller: 'DialogController',
                    templateUrl: 'confirm-dialog.html',
                    locals: {
                      displayOption: {
                        title: "เกิดข้อผิดพลาด !",
                        content: "เกิดข้อผิดพลาด btnUpdate ใน vanProfileController ระบบจะปิดอัตโนมัติ",
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
