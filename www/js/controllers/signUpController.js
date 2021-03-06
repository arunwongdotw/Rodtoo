appControllers.controller('signUpCtrl', function($scope, $timeout, $state, $stateParams, $ionicHistory, $http, myService, $mdDialog, $cordovaFileTransfer, $cordovaCamera, $cordovaDevice, $ionicPlatform, $mdSidenav) {
  $scope.signup = {};
  $scope.memberTypeValue = "selectType";
  $scope.addressValue = "select";

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
            content: "เกิดข้อผิดพลาด getProvinceList ใน signUpController ระบบจะปิดอัตโนมัติ",
            ok: "ตกลง"
          }
        }
      }).then(function(response) {
        ionic.Platform.exitApp();
      });
    });

  $scope.setAddressValue = function(province_id) {
    $scope.addressValue = province_id;
  };

  function checkImageURI(imageURI) {
    var str = imageURI;
    var res = str.match(/btnEvidencePickImage/g);
    if (res) {
      return "found";
    } else {
      return "notfound";
    }
  }

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

  $scope.btnEvidencePickImage = function() {
    var options3 = {
      quality: 100,
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
      allowEdit: false,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 1000,
      targetHeight: 1000,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };
    $cordovaCamera.getPicture(options3).then(function(imageURI) {
      var image = document.getElementById('evidence-image');
      image.src = imageURI;
    });
  };

  $scope.setMemberTypeValue = function(member_type) {
    $scope.memberTypeValue = member_type;
  };

  $scope.btnSignUp = function() {
    var checkEnglishNumberRegEx = /^[0-9a-zA-Z]+$/;
    var checkNumberRegEx = /^[0-9]+$/;
    if (($scope.signup.username != null) && ($scope.signup.username != "")) {
      if (checkEnglishNumberRegEx.test($scope.signup.username)) {
        if (($scope.signup.password != null) && ($scope.signup.password != "")) {
          if (checkEnglishNumberRegEx.test($scope.signup.password)) {
            if ($scope.signup.password == $scope.signup.confirmpassword) {
              if (($scope.signup.firstname != null) && ($scope.signup.firstname != "")) {
                if (($scope.signup.lastname != null) && ($scope.signup.lastname != "")) {
                  if ($scope.addressValue != "select") {
                    if (($scope.signup.phone != null) && ($scope.signup.phone != "")) {
                      if (checkNumberRegEx.test($scope.signup.phone)) {
                        if (($scope.signup.email != null) && ($scope.signup.email != "")) {
                          $mdDialog.show({
                            controller: 'DialogController',
                            templateUrl: 'confirm-dialog.html',
                            locals: {
                              displayOption: {
                                title: "สมัครสมาชิก ?",
                                content: "คุณแน่ใจที่จะสมัครสมาชิก",
                                ok: "ตกลง",
                                cancel: "ยกเลิก"
                              }
                            }
                          }).then(function(response) {
                            if ($scope.memberTypeValue == 1) {
                              var img = document.getElementById('sign-up-image');
                              var imageURI = img.src;
                              var server = myService.configAPI.webserviceURL + 'webservices/uploadSignUpImage.php?username=' + $scope.signup.username;
                              var trustHosts = true;
                              var options2 = {
                                fileKey: "myCameraImg",
                                fileName: imageURI.substr(imageURI.lastIndexOf('/') + 1),
                                mimeType: "image/jpeg",
                                chunkedMode: false
                              };
                              $cordovaFileTransfer.upload(server, imageURI, options2);
                              $http({
                                url: myService.configAPI.webserviceURL + 'webservices/signUp.php',
                                method: 'POST',
                                data: {
                                  var_username: $scope.signup.username,
                                  var_password: $scope.signup.password,
                                  var_firstname: $scope.signup.firstname,
                                  var_lastname: $scope.signup.lastname,
                                  var_provinceid: $scope.addressValue,
                                  var_phone: $scope.signup.phone,
                                  var_email: $scope.signup.email,
                                  var_membertype: $scope.memberTypeValue,
                                  var_membertypestatus: 0,
                                  var_evidence: "-"
                                }
                              }).then(function(response) {
                                if (response.data.results == 'duplicate_username') {
                                  $mdDialog.show({
                                    controller: 'DialogController',
                                    templateUrl: 'confirm-dialog.html',
                                    locals: {
                                      displayOption: {
                                        title: "Username ไม่ถูกต้อง !",
                                        content: "พบ Username นี้มีอยู่ในระบบแล้ว กรุณาเปลี่ยน Username",
                                        ok: "ตกลง"
                                      }
                                    }
                                  });
                                } else {
                                  $scope.response = response.data.results[0];
                                  $mdDialog.show({
                                    controller: 'DialogController',
                                    templateUrl: 'confirm-dialog.html',
                                    locals: {
                                      displayOption: {
                                        title: "สมัครสมาชิกสำเร็จ !",
                                        content: "คุณสมัครสมาชิกสำเร็จ ระบบจะเข้าสู่ระบบโดยอัตโนมัติ",
                                        ok: "ตกลง"
                                      }
                                    }
                                  }).then(function(response) {
                                    myService.memberDetailFromLogin = $scope.response;
                                    window.localStorage.memberUsername = $scope.signup.username;
                                    window.localStorage.memberType = $scope.memberTypeValue;
                                    var uuid = $cordovaDevice.getUUID();
                                    $http({
                                      url: myService.configAPI.webserviceURL + 'webservices/signUpNotification.php',
                                      method: 'POST',
                                      data: {
                                        var_uuid: uuid,
                                        var_token: window.localStorage.token,
                                        var_memberid: myService.memberDetailFromLogin.member_id
                                      }
                                    }).then(function(response) {
                                      $state.go('logincus.cusprofile');
                                    });
                                  });
                                }
                              }, function(error) {
                                $mdDialog.show({
                                  controller: 'DialogController',
                                  templateUrl: 'confirm-dialog.html',
                                  locals: {
                                    displayOption: {
                                      title: "เกิดข้อผิดพลาด !",
                                      content: "เกิดข้อผิดพลาด btnSignUp ใน signUpController ระบบจะปิดอัตโนมัติ",
                                      ok: "ตกลง"
                                    }
                                  }
                                }).then(function(response) {
                                  ionic.Platform.exitApp();
                                });
                              });
                            } else if ($scope.memberTypeValue == 2) {
                              var img = document.getElementById('sign-up-image');
                              var imageURI = img.src;
                              var server = myService.configAPI.webserviceURL + 'webservices/uploadSignUpImage.php?username=' + $scope.signup.username;
                              var trustHosts = true;
                              var options2 = {
                                fileKey: "myCameraImg",
                                fileName: imageURI.substr(imageURI.lastIndexOf('/') + 1),
                                mimeType: "image/jpeg",
                                chunkedMode: false
                              };
                              $cordovaFileTransfer.upload(server, imageURI, options2);
                              var img2 = document.getElementById('evidence-image');
                              var imageURI2 = img2.src;
                              var server2 = myService.configAPI.webserviceURL + 'webservices/uploadEvidenceImage.php?username=' + $scope.signup.username;
                              var trustHosts2 = true;
                              var options4 = {
                                fileKey: "myCameraImg",
                                fileName: imageURI2.substr(imageURI2.lastIndexOf('/') + 1),
                                mimeType: "image/jpeg",
                                chunkedMode: false
                              };
                              var chkImageURI = checkImageURI(imageURI2);
                              if (chkImageURI == "notfound") {
                                $cordovaFileTransfer.upload(server2, imageURI2, options4);
                                $http({
                                  url: myService.configAPI.webserviceURL + 'webservices/signUp.php',
                                  method: 'POST',
                                  data: {
                                    var_username: $scope.signup.username,
                                    var_password: $scope.signup.password,
                                    var_firstname: $scope.signup.firstname,
                                    var_lastname: $scope.signup.lastname,
                                    var_provinceid: $scope.addressValue,
                                    var_phone: $scope.signup.phone,
                                    var_email: $scope.signup.email,
                                    var_membertype: $scope.memberTypeValue,
                                    var_membertypestatus: 1,
                                    var_evidence: $scope.signup.username
                                  }
                                }).then(function(response) {
                                  if (response.data.results == 'duplicate_username') {
                                    $mdDialog.show({
                                      controller: 'DialogController',
                                      templateUrl: 'confirm-dialog.html',
                                      locals: {
                                        displayOption: {
                                          title: "Username ไม่ถูกต้อง !",
                                          content: "พบ Username นี้มีอยู่ในระบบแล้ว กรุณาเปลี่ยน Username",
                                          ok: "ตกลง"
                                        }
                                      }
                                    });
                                  } else {
                                    $mdDialog.show({
                                      controller: 'DialogController',
                                      templateUrl: 'confirm-dialog.html',
                                      locals: {
                                        displayOption: {
                                          title: "สมัครสมาชิกสำเร็จ !",
                                          content: "คุณสมัครสมาชิกสำเร็จ แต่ยังไม่สามารถใช้งานได้จนกว่าจะได้รับการอนุมัติจากผู้ดูแลระบบ",
                                          ok: "ตกลง"
                                        }
                                      }
                                    }).then(function(response) {
                                      $state.go('notlogin.login');
                                    });
                                  }
                                }, function(error) {
                                  $mdDialog.show({
                                    controller: 'DialogController',
                                    templateUrl: 'confirm-dialog.html',
                                    locals: {
                                      displayOption: {
                                        title: "เกิดข้อผิดพลาด !",
                                        content: "เกิดข้อผิดพลาด btnSignUp ใน signUpController ระบบจะปิดอัตโนมัติ",
                                        ok: "ตกลง"
                                      }
                                    }
                                  }).then(function(response) {
                                    ionic.Platform.exitApp();
                                  });
                                });
                              } else {
                                $mdDialog.show({
                                  controller: 'DialogController',
                                  templateUrl: 'confirm-dialog.html',
                                  locals: {
                                    displayOption: {
                                      title: "อัปโหลดหลักฐานไม่ถูกต้อง !",
                                      content: "กรุณาอัปโหลดรูปหลักฐาน (รูปบัตรประชาชน)",
                                      ok: "ตกลง"
                                    }
                                  }
                                });
                              }
                            } else if ($scope.memberTypeValue == 3) {
                              var img = document.getElementById('sign-up-image');
                              var imageURI = img.src;
                              var server = myService.configAPI.webserviceURL + 'webservices/uploadSignUpImage.php?username=' + $scope.signup.username;
                              var trustHosts = true;
                              var options2 = {
                                fileKey: "myCameraImg",
                                fileName: imageURI.substr(imageURI.lastIndexOf('/') + 1),
                                mimeType: "image/jpeg",
                                chunkedMode: false
                              };
                              $cordovaFileTransfer.upload(server, imageURI, options2);
                              var img2 = document.getElementById('evidence-image');
                              var imageURI2 = img2.src;
                              var server2 = myService.configAPI.webserviceURL + 'webservices/uploadEvidenceImage.php?username=' + $scope.signup.username;
                              var trustHosts2 = true;
                              var options4 = {
                                fileKey: "myCameraImg",
                                fileName: imageURI2.substr(imageURI2.lastIndexOf('/') + 1),
                                mimeType: "image/jpeg",
                                chunkedMode: false
                              };
                              var chkImageURI = checkImageURI(imageURI2);
                              if (chkImageURI == "notfound") {
                                $cordovaFileTransfer.upload(server2, imageURI2, options4);
                                $http({
                                  url: myService.configAPI.webserviceURL + 'webservices/signUp.php',
                                  method: 'POST',
                                  data: {
                                    var_username: $scope.signup.username,
                                    var_password: $scope.signup.password,
                                    var_firstname: $scope.signup.firstname,
                                    var_lastname: $scope.signup.lastname,
                                    var_provinceid: $scope.addressValue,
                                    var_phone: $scope.signup.phone,
                                    var_email: $scope.signup.email,
                                    var_membertype: $scope.memberTypeValue,
                                    var_membertypestatus: 0,
                                    var_evidence: "-"
                                  }
                                }).then(function(response) {
                                  if (response.data.results == 'duplicate_username') {
                                    $mdDialog.show({
                                      controller: 'DialogController',
                                      templateUrl: 'confirm-dialog.html',
                                      locals: {
                                        displayOption: {
                                          title: "Username ไม่ถูกต้อง !",
                                          content: "พบ Username นี้มีอยู่ในระบบแล้ว กรุณาเปลี่ยน Username",
                                          ok: "ตกลง"
                                        }
                                      }
                                    });
                                  } else {
                                    $scope.response = response.data.results[0];
                                    $mdDialog.show({
                                      controller: 'DialogController',
                                      templateUrl: 'confirm-dialog.html',
                                      locals: {
                                        displayOption: {
                                          title: "สมัครสมาชิกสำเร็จ !",
                                          content: "คุณสมัครสมาชิกสำเร็จ ระบบจะเข้าสู่ระบบโดยอัตโนมัติ",
                                          ok: "ตกลง"
                                        }
                                      }
                                    }).then(function(response) {
                                      myService.memberDetailFromLogin = $scope.response;
                                      window.localStorage.memberUsername = $scope.signup.username;
                                      window.localStorage.memberType = $scope.memberTypeValue;
                                      var uuid = $cordovaDevice.getUUID();
                                      $http({
                                        url: myService.configAPI.webserviceURL + 'webservices/signUpNotification.php',
                                        method: 'POST',
                                        data: {
                                          var_uuid: uuid,
                                          var_token: window.localStorage.token,
                                          var_memberid: myService.memberDetailFromLogin.member_id
                                        }
                                      }).then(function(response) {
                                        $state.go('loginvan.vanprofile');
                                      });
                                    });
                                  }
                                }, function(error) {
                                  $mdDialog.show({
                                    controller: 'DialogController',
                                    templateUrl: 'confirm-dialog.html',
                                    locals: {
                                      displayOption: {
                                        title: "เกิดข้อผิดพลาด !",
                                        content: "เกิดข้อผิดพลาด btnSignUp ใน signUpController ระบบจะปิดอัตโนมัติ",
                                        ok: "ตกลง"
                                      }
                                    }
                                  }).then(function(response) {
                                    ionic.Platform.exitApp();
                                  });
                                });
                              } else {
                                $mdDialog.show({
                                  controller: 'DialogController',
                                  templateUrl: 'confirm-dialog.html',
                                  locals: {
                                    displayOption: {
                                      title: "อัปโหลดหลักฐานไม่ถูกต้อง !",
                                      content: "กรุณาอัปโหลดรูปหลักฐาน (รูปบัตรประชาชน)",
                                      ok: "ตกลง"
                                    }
                                  }
                                });
                              }
                            }
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
                          title: "จังหวัดที่อยู่ไม่ถูกต้อง !",
                          content: "กรุณาเลือกจังหวัดที่อยู่",
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
            } else {
              $mdDialog.show({
                controller: 'DialogController',
                templateUrl: 'confirm-dialog.html',
                locals: {
                  displayOption: {
                    title: "ยืนยัน Password ไม่ถูกต้อง !",
                    content: "กรุณากรอกยืนยัน Password ให้ตรงกับ Password",
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
                  title: "Password ไม่ถูกต้อง !",
                  content: "Password ต้องเป็นภาษาอังกฤษหรือตัวเลขเท่านั้น",
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
                title: "Password ไม่ถูกต้อง !",
                content: "กรุณากรอก Password 6-12 ตัวอักษร",
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
              title: "Username ไม่ถูกต้อง !",
              content: "Username ต้องเป็นภาษาอังกฤษหรือตัวเลขเท่านั้น",
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
            title: "Username ไม่ถูกต้อง !",
            content: "กรุณากรอก Username 6-12 ตัวอักษร",
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
      if ($state.current.name == 'notlogin.signup') {
        if (jQuery('[id^=dialog]').length == 0) {
          $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            targetEvent: null,
            locals: {
              displayOption: {
                title: "การยืนยัน",
                content: "คุณแน่ใจที่จะออกจากแอปพลิเคชัน ?",
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
