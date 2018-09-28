appControllers.controller('signUpCtrl', function($scope, $timeout, $state, $stateParams, $ionicHistory, $http, myService, $mdDialog, $cordovaFileTransfer, $cordovaCamera) {
  $scope.signup = {};
  $scope.memberTypeValue = "selectType";
  $scope.addressValue = "select";

  $scope.navigateTo = function(stateName) {
    $timeout(function() {
      if ($ionicHistory.currentStateName() != stateName) {
        $ionicHistory.nextViewOptions({
          disableAnimate: false,
          disableBack: true
        });
        $state.go(stateName);
      }
    }, ($scope.isAnimated ? 300 : 0));
  };

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
    }, function(error) {
      $mdDialog.show({
        controller: 'DialogController',
        templateUrl: 'confirm-dialog.html',
        locals: {
          displayOption: {
            title: "เกิดข้อผิดพลาด !",
            content: "เกิดข้อผิดพลาด btnSignUpPickImage ใน signUpController ระบบจะปิดอัตโนมัติ",
            ok: "ตกลง"
          }
        }
      }).then(function(response) {
        ionic.Platform.exitApp();
      });
    });
  };

  $scope.btnEvidencePickImage = function() {
    var options3 = {
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
    $cordovaCamera.getPicture(options3).then(function(imageURI) {
      var image = document.getElementById('evidence-image');
      image.src = imageURI;
    }, function(error) {
      $mdDialog.show({
        controller: 'DialogController',
        templateUrl: 'confirm-dialog.html',
        locals: {
          displayOption: {
            title: "เกิดข้อผิดพลาด !",
            content: "เกิดข้อผิดพลาด btnEvidencePickImage ใน signUpController ระบบจะปิดอัตโนมัติ",
            ok: "ตกลง"
          }
        }
      }).then(function(response) {
        ionic.Platform.exitApp();
      });
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
                                if ($scope.memberTypeValue == 1) {
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
                                    window.localStorage.memberUsername = $scope.signup.username;
                                    $state.go('logincus.cusbooking');
                                  });
                                } else if ($scope.memberTypeValue == 2) {
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
                            if (chkImageURI == "found") {
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
                                  if ($scope.memberTypeValue == 1) {
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
                                      window.localStorage.memberUsername = $scope.signup.username;
                                      $state.go('logincus.cusbooking');
                                    });
                                  } else if ($scope.memberTypeValue == 2) {
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
                            } else if (chkImageURI == "notfound") {
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
                                  if ($scope.memberTypeValue == 1) {
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
                                      window.localStorage.memberUsername = $scope.signup.username;
                                      $state.go('logincus.cusbooking');
                                    });
                                  } else if ($scope.memberTypeValue == 2) {
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
                            }
                          }
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
});
