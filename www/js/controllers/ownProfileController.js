appControllers.controller('ownProfileCtrl', function($scope, $timeout, $state, $ionicHistory, $mdDialog, $http, myService, $mdSidenav, $cordovaFileTransfer, $cordovaCamera) {
  $scope.own = {};

  $http.get(myService.configAPI.webserviceURL + 'webservices/getMemberDetail.php?memberUsername=' + window.localStorage.memberUsername)
    .then(function(response) {
      $scope.randomNumber = Math.random();
      $scope.own.profileImg = 'http://1did.net/rodtoo/img/img_profile/' + response.data.results[0].member_username + '.jpg?random=' + $scope.randomNumber;
      $scope.own.firstname = response.data.results[0].member_firstname;
      $scope.own.lastname = response.data.results[0].member_lastname;
      $scope.addressValue = response.data.results[0].member_province_id;
      $scope.own.phone = response.data.results[0].member_phone;
      $scope.own.email = response.data.results[0].member_email;
      $scope.own.username = response.data.results[0].member_username;
      $scope.own.memberid = response.data.results[0].member_id;
    });

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
            content: "เกิดข้อผิดพลาด getProvinceList ใน ownProfileController ระบบจะปิดอัตโนมัติ",
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

  function checkImageURI(imageURI) {
    var str = imageURI;
    var res = str.match(/1did/g);
    if (res) {
      return "found";
    } else {
      return "notfound";
    }
  }

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

  $scope.btnUpdate = function() {
    var checkNumberRegEx = /^[0-9]+$/;
    if (($scope.own.firstname != null) && ($scope.own.firstname != "")) {
      if (($scope.own.lastname != null) && ($scope.own.lastname != "")) {
        if (($scope.own.phone != null) && ($scope.own.phone != "")) {
          if (checkNumberRegEx.test($scope.own.phone)) {
            if (($scope.own.email != null) && ($scope.own.email != "")) {
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
                var server = myService.configAPI.webserviceURL + 'webservices/uploadSignUpImage.php?username=' + $scope.own.username;
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
                    var_memberid: $scope.own.memberid,
                    var_firstname: $scope.own.firstname,
                    var_lastname: $scope.own.lastname,
                    var_provinceid: $scope.addressValue,
                    var_phone: $scope.own.phone,
                    var_email: $scope.own.email
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
                    $state.go('loginown.ownbookinglist');
                  });
                }, function(error) {
                  $mdDialog.show({
                    controller: 'DialogController',
                    templateUrl: 'confirm-dialog.html',
                    locals: {
                      displayOption: {
                        title: "เกิดข้อผิดพลาด !",
                        content: "เกิดข้อผิดพลาด btnUpdate ใน ownProfileController ระบบจะปิดอัตโนมัติ",
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
