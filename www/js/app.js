//
//Welcome to app.js
//This is main application config of project. You can change a setting of :
//  - Global Variable
//  - Theme setting
//  - Icon setting
//  - Register View
//  - Spinner setting
//  - Custom style
//
//Global variable use for setting color, start page, message, oAuth key.
if ((window.localStorage.memberUsername == "") || (window.localStorage.memberUsername == null)) {
  url = "/notlogin/login";
  state = "notlogin.login";
} else {
  if (window.localStorage.memberType == "1") {
    url = "/logincus/cusprofile";
    state = "logincus.cusprofile";
  } else if (window.localStorage.memberType == "2") {
    url = "/loginown/ownprofile";
    state = "loginown.ownprofile";
  } else if (window.localStorage.memberType == "3") {
    url = "/loginvan/vanprofile";
    state = "loginvan.vanprofile";
  } else if (window.localStorage.memberType == "4") {
    url = "/loginadmin/adminpaymentqueueselect";
    state = "loginadmin.adminpaymentqueueselect";
  }
}

var db = null; //Use for SQLite database.
window.globalVariable = {
    //custom color style variable
    color: {
        appPrimaryColor: "",
        dropboxColor: "#017EE6",
        facebookColor: "#3C5C99",
        foursquareColor: "#F94777",
        googlePlusColor: "#D73D32",
        instagramColor: "#517FA4",
        wordpressColor: "#0087BE"
    },// End custom color style variable
    startPage: {
        url: url,//Url of start page.
        state: state//State name of start page.
    },
    // startPage: {
    //     url: "notlogin/login",//Url of start page.
    //     state: "notlogin.login"//State name of start page.
    // },
    message: {
        errorMessage: "Technical error please try again later." //Default error message.
    },
    oAuth: {
      dropbox: "your_api_key",//Use for Dropbox API clientID.
      facebook: "your_api_key",//Use for Facebook API appID.
      foursquare: "your_api_key", //Use for Foursquare API clientID.
      instagram: "your_api_key",//Use for Instagram API clientID.
      googlePlus: "your_api_key",//Use for Google API clientID.
    },
    adMob: "your_api_key" //Use for AdMob API clientID.
};// End Global variable


angular.module('starter', ['ionic','ngIOS9UIWebViewPatch', 'starter.controllers', 'starter.services', 'ngMaterial', 'ngMessages', 'ngCordova', 'ionic-datepicker', 'ionic-timepicker'])
    .run(function ($ionicPlatform, $cordovaSQLite, $rootScope, $ionicHistory, $state, $mdDialog, $mdBottomSheet, $cordovaDevice, $http, $ionicPopup, myService, $cordovaPushV5) {
      $ionicPlatform.ready(function() {
          if (window.Connection) {
            if (navigator.connection.type == Connection.NONE) {
              $mdDialog.show({
                controller: 'DialogController',
                templateUrl: 'confirm-dialog.html',
                locals: {
                  displayOption: {
                    title: "ไม่มีการเชื่อมต่ออินเทอร์เน็ต !",
                    content: "โทรศัพท์ของคุณยังไม่ได้เชื่อมต่ออินเทอร์เน็ต กรุณาเชื่อมต่ออินเทอร์เน็ตก่อนใช้งาน",
                    ok: "ตกลง"
                  }
                }
              }).then(function() {
                ionic.Platform.exitApp();
              });
            }
          }
        });

        //Create database table of contracts by using sqlite database.
        //Table schema :
        //Column	   Type	     Primary key
        //  id	        Integer	    Yes
        //  firstName	Text	    No
        //  lastName	Text	    No
        //  telephone	Text	    No
        //  email	    Text	    No
        //  note	    Text	    No
        //  createDate	DateTime	No
        //  age	        Integer	    No
        //  isEnable	Boolean	    No

        function initialSQLite() {
            db = window.cordova ? $cordovaSQLite.openDB("contract.db") : window.openDatabase("contract.db", "1.0", "IonicMaterialDesignDB", -1);
            $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS contracts " +
                "( id           integer primary key   , " +
                "  firstName    text                  , " +
                "  lastName     text                  , " +
                "  telephone    text                  , " +
                "  email        text                  , " +
                "  note         text                  , " +
                "  createDate   dateTime              , " +
                "  age          integer               , " +
                "  isEnable     Boolean)                ");
        };
        // End creating SQLite database table.

        // Create custom defaultStyle.
        function getDefaultStyle() {
            return "" +
                ".material-background-nav-bar { " +
                "   background-color        : " + appPrimaryColor + " !important; " +
                "   border-style            : none;" +
                "}" +
                ".md-primary-color {" +
                "   color                     : " + appPrimaryColor + " !important;" +
                "}";
        }// End create custom defaultStyle

        // Create custom style for product view.
        function getProductStyle() {
            return "" +
                ".material-background-nav-bar { " +
                "   background-color        : " + appPrimaryColor + " !important;" +
                "   border-style            : none;" +
                "   background-image        : url('img/background_cover_pixels.png') !important;" +
                "   background-size         : initial !important;" +
                "}" +
                ".md-primary-color {" +
                "   color                     : " + appPrimaryColor + " !important;" +
                "}";
        }// End create custom style for product view.

        // Create custom style for contract us view.
        function getContractUsStyle() {
            return "" +
                ".material-background-nav-bar { " +
                "   background-color        : transparent !important;" +
                "   border-style            : none;" +
                "   background-image        : none !important;" +
                "   background-position-y   : 4px !important;" +
                "   background-size         : initial !important;" +
                "}" +
                ".md-primary-color {" +
                "   color                     : " + appPrimaryColor + " !important;" +
                "}";
        } // End create custom style for contract us view.

        // Create custom style for Social Network view.
        function getSocialNetworkStyle(socialColor) {
            return "" +
                ".material-background-nav-bar {" +
                "   background              : " + socialColor + " !important;" +
                "   border-style            : none;" +
                "} " +
                "md-ink-bar {" +
                "   color                   : " + socialColor + " !important;" +
                "   background              : " + socialColor + " !important;" +
                "}" +
                "md-tab-item {" +
                "   color                   : " + socialColor + " !important;" +
                "}" +
                " md-progress-circular.md-warn .md-inner .md-left .md-half-circle {" +
                "   border-left-color       : " + socialColor + " !important;" +
                "}" +
                " md-progress-circular.md-warn .md-inner .md-left .md-half-circle, md-progress-circular.md-warn .md-inner .md-right .md-half-circle {" +
                "    border-top-color       : " + socialColor + " !important;" +
                "}" +
                " md-progress-circular.md-warn .md-inner .md-gap {" +
                "   border-top-color        : " + socialColor + " !important;" +
                "   border-bottom-color     : " + socialColor + " !important;" +
                "}" +
                "md-progress-circular.md-warn .md-inner .md-right .md-half-circle {" +
                "  border-right-color       : " + socialColor + " !important;" +
                " }" +
                ".spinner-android {" +
                "   stroke                  : " + socialColor + " !important;" +
                "}" +
                ".md-primary-color {" +
                "   color                   : " + socialColor + " !important;" +
                "}" +
                "a.md-button.md-primary, .md-button.md-primary {" +
                "   color                   : " + socialColor + " !important;" +
                "}";
        }// End create custom style for Social Network view.


        function initialRootScope() {
            $rootScope.appPrimaryColor = appPrimaryColor;// Add value of appPrimaryColor to rootScope for use it to base color.
            $rootScope.isAndroid = ionic.Platform.isAndroid();// Check platform of running device is android or not.
            $rootScope.isIOS = ionic.Platform.isIOS();// Check platform of running device is ios or not.
        };

        function hideActionControl() {
            //For android if user tap hardware back button, Action and Dialog should be hide.
            $mdBottomSheet.cancel();
            $mdDialog.cancel();
        };


        // createCustomStyle will change a style of view while view changing.
        // Parameter :
        // stateName = name of state that going to change for add style of that page.
        function createCustomStyle(stateName) {
            var customStyle =
                ".material-background {" +
                "   background-color          : " + appPrimaryColor + " !important;" +
                "   border-style              : none;" +
                "}" +
                ".spinner-android {" +
                "   stroke                    : " + appPrimaryColor + " !important;" +
                "}";

            switch (stateName) {
                case "app.productList" :
                case "app.productDetail":
                case "app.productCheckout":
                case "app.clothShop" :
                case "app.catalog" :
                    customStyle += getProductStyle();
                    break;
                case "app.dropboxLogin" :
                case "app.dropboxProfile":
                case "app.dropboxFeed" :
                    customStyle += getSocialNetworkStyle(window.globalVariable.color.dropboxColor);
                    break;
                case "app.facebookLogin" :
                case "app.facebookProfile":
                case "app.facebookFeed" :
                case "app.facebookFriendList":
                    customStyle += getSocialNetworkStyle(window.globalVariable.color.facebookColor);
                    break;
                case "app.foursquareLogin" :
                case "app.foursquareProfile":
                case "app.foursquareFeed" :
                    customStyle += getSocialNetworkStyle(window.globalVariable.color.foursquareColor);
                    break;
                case "app.googlePlusLogin" :
                case "app.googlePlusProfile":
                case "app.googlePlusFeed" :
                    customStyle += getSocialNetworkStyle(window.globalVariable.color.googlePlusColor);
                    break;
                case "app.instagramLogin" :
                case "app.instagramProfile":
                case "app.instagramFeed" :
                    customStyle += getSocialNetworkStyle(window.globalVariable.color.instagramColor);
                    break;
                case "app.wordpressLogin" :
                case "app.wordpressFeed":
                case "app.wordpressPost" :
                    customStyle += getSocialNetworkStyle(window.globalVariable.color.wordpressColor);
                    break;
                case "app.contractUs":
                    customStyle += getContractUsStyle();
                    break;
                default:
                    customStyle += getDefaultStyle();
                    break;
            }
            return customStyle;
        }// End createCustomStyle

        // Add custom style while initial application.
        $rootScope.customStyle = createCustomStyle(window.globalVariable.startPage.state);

        $ionicPlatform.ready(function () {
            // android platform 6.3.0
            // cordova-plugin-fcm@2.1.2 "FCMPlugin"
            // FCMPlugin.getToken(
            //     function(token) {
            //       $http({
            //         url: "http://1did.net/rodtoo/php_push/token.php",
            //         method: 'POST',
            //         data: {
            //           var_token: token,
            //           var_uid: $cordovaDevice.getUUID()
            //         }
            //       }).then(function(response) {
            //         console.log(response);
            //       });
            //     }
            // );
            //
            // FCMPlugin.onNotification(function(data) {
            //     console.log(data);
            //     if (data.wasTapped) {
            //         //Notification was received on device tray and tapped by the user.
            //         alert(JSON.stringify(data));
            //     } else {
            //         //Notification was received in foreground. Maybe the user needs to be notified.
            //         alert(JSON.stringify(data));
            //     }
            // });

            // FCMPlugin.onNotification(
            //     function(data) {
            //       if (data.wasTapped) {
            //           // alert( JSON.stringify(data) );
            //           console.log(data);
            //           var alertPopup = $ionicPopup.alert({
            //             title: data.title,
            //             template: data.body
            //           });
            //       } else {
            //         console.log(data);
            //           // alert( JSON.stringify(data) );
            //           var alertPopup = $ionicPopup.alert({
            //             title: data.title,
            //             template: data.body
            //           });
            //       }
            //     }
            // );

            // cordova plugin add phonegap-plugin-push@1.10.5 --variable SENDER_ID="851752018079"
            if (window.cordova) {
              var options = {
                android: {
                  icon: "notification_icon"
                },
                ios: {
                  alert: "true",
                  badge: "true",
                  sound: "true"
                },
                windows: {}
              };

              // initialize
              $cordovaPushV5.initialize(options)
                .then(function() {
                  // start listening for new notifications
                  $cordovaPushV5.onNotification();
                  // start listening for errors
                  $cordovaPushV5.onError();
                  // register to get registrationId
                  $cordovaPushV5.register()
                    .then(function(registrationId) {
                      window.localStorage.token = registrationId;
                      // var dataSend = {
                      //   var_uid: $cordovaDevice.getUUID(),
                      //   var_token: registrationId
                      // };
                      // service เรียกใช้ฟังก์ชั่น notifyService ส่งค่าไปยัง server
                      // notifyService.setNotify(dataSend)
                      //   .then(function(response) {
                      //     // ทดสอบแสดงค่าว่าบันทึกสำเร็จหรือไม่
                      //     console.log(response);
                      //   });
                    });
                });

                // triggered every time notification received
                $rootScope.$on('$cordovaPushV5:notificationReceived', function(event, data) {
                  console.log(data);
                  if (data.additionalData.foreground == true) {
                    $mdDialog.show({
                      controller: 'DialogController',
                      templateUrl: 'confirm-dialog.html',
                      locals: {
                        displayOption: {
                          title: data.title,
                          content: data.message,
                          ok: "ตกลง"
                        }
                      }
                    });
                  }
                });

                // triggered every time error occurs
                $rootScope.$on('$cordovaPushV5:errorOcurred', function(event, e) {
                  console.log(e);
                  // e.message
                });
            }

            ionic.Platform.isFullScreen = true;
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }

            // initialSQLite();
            initialRootScope();

            //Checking if view is changing it will go to this function.
            $rootScope.$on('$ionicView.beforeEnter', function () {
                //hide Action Control for android back button.
                hideActionControl();
                // Add custom style ti view.
                $rootScope.customStyle = createCustomStyle($ionicHistory.currentStateName());
            });
        });

    })

    .config(function ($ionicConfigProvider, $stateProvider, $urlRouterProvider, $mdThemingProvider, $mdColorPalette, $mdIconProvider, ionicDatePickerProvider, ionicTimePickerProvider) {
        var datePickerObj = {
            inputDate: new Date(),
            titleLabel: 'Select a Date',
            setLabel: 'Set',
            todayLabel: 'Today',
            closeLabel: 'Close',
            mondayFirst: false,
            weeksList: ["S", "M", "T", "W", "T", "F", "S"],
            monthsList: ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"],
            templateType: 'popup',
            from: new Date(2012, 8, 1),
            to: new Date(2018, 8, 1),
            showTodayButton: true,
            dateFormat: 'dd MMMM yyyy',
            closeOnSelect: false,
            disableWeekdays: []
        };

        ionicDatePickerProvider.configDatePicker(datePickerObj);

        var timePickerObj = {
            inputTime: (((new Date()).getHours() * 60 * 60) + ((new Date()).getMinutes() * 60)),
            format: 24,
            step: 15,
            setLabel: 'Set',
            closeLabel: 'Close'
        };
        ionicTimePickerProvider.configTimePicker(timePickerObj);

        // Use for change ionic spinner to android pattern.
        $ionicConfigProvider.spinner.icon("android");
        $ionicConfigProvider.views.swipeBackEnabled(false);
        $ionicConfigProvider.navBar.alignTitle('center');

        // mdIconProvider is function of Angular Material.
        // It use for reference .SVG file and improve performance loading.
        $mdIconProvider
            .icon('facebook', 'img/icons/facebook.svg')
            .icon('twitter', 'img/icons/twitter.svg')
            .icon('mail', 'img/icons/mail.svg')
            .icon('message', 'img/icons/message.svg')
            .icon('share-arrow', 'img/icons/share-arrow.svg')
            .icon('more', 'img/icons/more_vert.svg');

        //mdThemingProvider use for change theme color of Ionic Material Design Application.
        /* You can select color from Material Color List configuration :
         * red
         * pink
         * purple
         * purple
         * deep-purple
         * indigo
         * blue
         * light-blue
         * cyan
         * teal
         * green
         * light-green
         * lime
         * yellow
         * amber
         * orange
         * deep-orange
         * brown
         * grey
         * blue-grey
         */
        //Learn more about material color patten: https://www.materialpalette.com/
        //Learn more about material theme: https://material.angularjs.org/latest/#/Theming/01_introduction
        $mdThemingProvider
            .theme('default')
            .primaryPalette('indigo')
            .accentPalette('blue');

        appPrimaryColor = $mdColorPalette[$mdThemingProvider._THEMES.default.colors.primary.name]["500"]; //Use for get base color of theme.

        //$stateProvider is using for add or edit HTML view to navigation bar.
        //
        //Schema :
        //state_name(String)      : Name of state to use in application.
        //page_name(String)       : Name of page to present at localhost url.
        //cache(Bool)             : Cache of view and controller default is true. Change to false if you want page reload when application navigate back to this view.
        //html_file_path(String)  : Path of html file.
        //controller_name(String) : Name of Controller.
        //
        //Learn more about ionNavView at http://ionicframework.com/docs/api/directive/ionNavView/
        //Learn more about  AngularUI Router's at https://github.com/angular-ui/ui-router/wiki
        $stateProvider
            .state('notlogin', {
                url: "/notlogin",
                cache: false,
                reload: true,
                abstract: true,
                templateUrl: "templates/not-login-menu.html",
                controller: 'notLoginMenuCtrl'
            })
            .state('logincus', {
                url: "/logincus",
                cache: false,
                reload: true,
                abstract: true,
                templateUrl: "templates/login-cus-menu.html",
                controller: 'loginCusMenuCtrl'
            })
            .state('loginown', {
                url: "/loginown",
                cache: false,
                reload: true,
                abstract: true,
                templateUrl: "templates/login-own-menu.html",
                controller: 'loginOwnMenuCtrl'
            })
            .state('loginvan', {
                url: "/loginvan",
                cache: false,
                reload: true,
                abstract: true,
                templateUrl: "templates/login-van-menu.html",
                controller: 'loginVanMenuCtrl'
            })
            .state('loginadmin', {
                url: "/loginadmin",
                cache: false,
                reload: true,
                abstract: true,
                templateUrl: "templates/login-admin-menu.html",
                controller: 'loginAdminMenuCtrl'
            })
            .state('notlogin.login', {
                url: "/login",
                cache: false,
                reload: true,
                views: {
                    'menuContent': {
                        templateUrl: "templates/login.html",
                        controller: 'loginCtrl'
                    }
                }
            })
            .state('notlogin.signup', {
                url: "/signup",
                cache: false,
                reload: true,
                views: {
                    'menuContent': {
                        templateUrl: "templates/sign-up.html",
                        controller: 'signUpCtrl'
                    }
                }
            })
            .state('logincus.cusbooking', {
                url: "/cusbooking",
                cache: false,
                reload: true,
                views: {
                    'menuContent': {
                        templateUrl: "templates/cus-booking.html",
                        controller: 'cusBookingCtrl'
                    }
                }
            })
            .state('logincus.cusbookingsuccess', {
                url: "/cusbookingsuccess",
                cache: false,
                reload: true,
                views: {
                    'menuContent': {
                        templateUrl: "templates/cus-booking-success.html",
                        controller: 'cusBookingSuccessCtrl'
                    }
                }
            })
            .state('logincus.cusbookinglist', {
                url: "/cusbookinglist",
                cache: false,
                reload: true,
                views: {
                    'menuContent': {
                        templateUrl: "templates/cus-booking-list.html",
                        controller: 'cusBookingListCtrl'
                    }
                }
            })
            .state('logincus.cusbookingdetail', {
                url: "/cusbookingdetail",
                cache: false,
                reload: true,
                views: {
                    'menuContent': {
                        templateUrl: "templates/cus-booking-detail.html",
                        controller: 'cusBookingDetailCtrl'
                    }
                }
            })
            .state('logincus.payment', {
                url: "/payment",
                cache: false,
                reload: true,
                views: {
                    'menuContent': {
                        templateUrl: "templates/payment.html",
                        controller: 'paymentCtrl'
                    }
                }
            })
            .state('loginown.ownbookinglist', {
                url: "/ownbookinglist",
                cache: false,
                reload: true,
                views: {
                    'menuContent': {
                        templateUrl: "templates/own-booking-list.html",
                        controller: 'ownBookingListCtrl'
                    }
                }
            })
            .state('loginown.ownpaymentlist', {
                url: "/ownpaymentlist",
                cache: false,
                reload: true,
                views: {
                    'menuContent': {
                        templateUrl: "templates/own-payment-list.html",
                        controller: 'ownPaymentListCtrl'
                    }
                }
            })
            .state('loginown.ownpaymentdetail', {
                url: "/ownpaymentdetail",
                cache: false,
                reload: true,
                views: {
                    'menuContent': {
                        templateUrl: "templates/own-payment-detail.html",
                        controller: 'ownPaymentDetailCtrl'
                    }
                }
            })
            .state('loginown.ownbookingdetail', {
                url: "/ownbookingdetail",
                cache: false,
                reload: true,
                views: {
                    'menuContent': {
                        templateUrl: "templates/own-booking-detail.html",
                        controller: 'ownBookingDetailCtrl'
                    }
                }
            })
            .state('loginown.addvan', {
                url: "/addvan",
                cache: false,
                reload: true,
                views: {
                    'menuContent': {
                        templateUrl: "templates/add-van.html",
                        controller: 'addVanCtrl'
                    }
                }
            })
            .state('loginown.ownvanlist', {
                url: "/ownvanlist",
                cache: false,
                reload: true,
                views: {
                    'menuContent': {
                        templateUrl: "templates/own-van-list.html",
                        controller: 'ownVanListCtrl'
                    }
                }
            })
            .state('loginown.editvan', {
                url: "/editvan",
                cache: false,
                reload: true,
                views: {
                    'menuContent': {
                        templateUrl: "templates/edit-van.html",
                        controller: 'editVanCtrl'
                    }
                }
            })
            .state('loginown.ownvanselect', {
                url: "/ownvanselect",
                cache: false,
                reload: true,
                views: {
                    'menuContent': {
                        templateUrl: "templates/own-van-select.html",
                        controller: 'ownVanSelectCtrl'
                    }
                }
            })
            .state('loginown.ownpointlist', {
                url: "/ownpointlist",
                cache: false,
                reload: true,
                views: {
                    'menuContent': {
                        templateUrl: "templates/own-point-list.html",
                        controller: 'ownPointListCtrl'
                    }
                }
            })
            .state('loginown.addpoint', {
                url: "/addpoint",
                cache: false,
                reload: true,
                views: {
                    'menuContent': {
                        templateUrl: "templates/add-point.html",
                        controller: 'addPointCtrl'
                    }
                }
            })
            .state('loginown.editpoint', {
                url: "/editpoint",
                cache: false,
                reload: true,
                views: {
                    'menuContent': {
                        templateUrl: "templates/edit-point.html",
                        controller: 'editPointCtrl'
                    }
                }
            })
            .state('loginown.owngetinlist', {
                url: "/owngetinlist",
                cache: false,
                reload: true,
                views: {
                    'menuContent': {
                        templateUrl: "templates/own-get-in-list.html",
                        controller: 'ownGetInListCtrl'
                    }
                }
            })
            .state('loginown.addgetin', {
                url: "/addgetin",
                cache: false,
                reload: true,
                views: {
                    'menuContent': {
                        templateUrl: "templates/add-get-in.html",
                        controller: 'addGetInCtrl'
                    }
                }
            })
            .state('loginown.editgetin', {
                url: "/editgetin",
                cache: false,
                reload: true,
                views: {
                    'menuContent': {
                        templateUrl: "templates/edit-get-in.html",
                        controller: 'editGetInCtrl'
                    }
                }
            })
            .state('loginown.ownprofile', {
                url: "/ownprofile",
                cache: false,
                reload: true,
                views: {
                    'menuContent': {
                        templateUrl: "templates/own-profile.html",
                        controller: 'ownProfileCtrl'
                    }
                }
            })
            .state('logincus.cusprofile', {
                url: "/cusprofile",
                cache: false,
                reload: true,
                views: {
                    'menuContent': {
                        templateUrl: "templates/cus-profile.html",
                        controller: 'cusProfileCtrl'
                    }
                }
            })
            .state('loginown.queue', {
                url: "/queue",
                cache: false,
                reload: true,
                views: {
                    'menuContent': {
                        templateUrl: "templates/queue.html",
                        controller: 'queueCtrl'
                    }
                }
            })
            .state('loginvan.van', {
                url: "/van",
                cache: false,
                reload: true,
                views: {
                    'menuContent': {
                        templateUrl: "templates/van.html",
                        controller: 'vanCtrl'
                    }
                }
            })
            .state('loginvan.vanprofile', {
                url: "/vanprofile",
                cache: false,
                reload: true,
                views: {
                    'menuContent': {
                        templateUrl: "templates/van-profile.html",
                        controller: 'vanProfileCtrl'
                    }
                }
            })
            .state('loginown.ownvandetail', {
                url: "/ownvandetail",
                cache: false,
                reload: true,
                views: {
                    'menuContent': {
                        templateUrl: "templates/own-van-detail.html",
                        controller: 'ownVanDetailCtrl'
                    }
                }
            })
            .state('loginvan.vanbookinglist', {
                url: "/vanbookinglist",
                cache: false,
                reload: true,
                views: {
                    'menuContent': {
                        templateUrl: "templates/van-booking-list.html",
                        controller: 'vanBookingListCtrl'
                    }
                }
            })
            .state('loginvan.vanbookingdetail', {
                url: "/vanbookingdetail",
                cache: false,
                reload: true,
                views: {
                    'menuContent': {
                        templateUrl: "templates/van-booking-detail.html",
                        controller: 'vanBookingDetailCtrl'
                    }
                }
            })
            .state('notlogin.map', {
                url: "/map",
                cache: false,
                reload: true,
                views: {
                    'menuContent': {
                        templateUrl: "templates/map.html",
                        controller: 'mapCtrl'
                    }
                }
            })
            .state('loginvan.vanmap', {
                url: "/vanmap",
                cache: false,
                reload: true,
                views: {
                    'menuContent': {
                        templateUrl: "templates/van-map.html",
                        controller: 'vanMapCtrl'
                    }
                }
            })
            .state('logincus.cusmap', {
                url: "/cusmap",
                cache: false,
                reload: true,
                views: {
                    'menuContent': {
                        templateUrl: "templates/cus-map.html",
                        controller: 'cusMapCtrl'
                    }
                }
            })
            .state('logincus.postpone', {
                url: "/postpone",
                cache: false,
                reload: true,
                views: {
                    'menuContent': {
                        templateUrl: "templates/postpone.html",
                        controller: 'postponeCtrl'
                    }
                }
            })
            .state('loginadmin.adminpaymentlist', {
                url: "/adminpaymentlist",
                cache: false,
                reload: true,
                views: {
                    'menuContent': {
                        templateUrl: "templates/admin-payment-list.html",
                        controller: 'adminPaymentListCtrl'
                    }
                }
            })
            .state('loginadmin.adminpaymentdetail', {
                url: "/adminpaymentdetail",
                cache: false,
                reload: true,
                views: {
                    'menuContent': {
                        templateUrl: "templates/admin-payment-detail.html",
                        controller: 'adminPaymentDetailCtrl'
                    }
                }
            })
            .state('loginadmin.adminpaymentqueueselect', {
                url: "/adminpaymentqueueselect",
                cache: false,
                reload: true,
                views: {
                    'menuContent': {
                        templateUrl: "templates/admin-payment-queue-select.html",
                        controller: 'adminPaymentQueueSelectCtrl'
                    }
                }
            })
            .state('loginadmin.adminpaymentdatetimeselect', {
                url: "/adminpaymentdatetimeselect",
                cache: false,
                reload: true,
                views: {
                    'menuContent': {
                        templateUrl: "templates/admin-payment-datetime-select.html",
                        controller: 'adminPaymentDatetimeSelectCtrl'
                    }
                }
            })
            .state('loginown.ownpromotionlist', {
                url: "/ownpromotionlist",
                cache: false,
                reload: true,
                views: {
                    'menuContent': {
                        templateUrl: "templates/own-promotion-list.html",
                        controller: 'ownPromotionListCtrl'
                    }
                }
            })
            .state('loginown.addpromotion', {
                url: "/addpromotion",
                cache: false,
                reload: true,
                views: {
                    'menuContent': {
                        templateUrl: "templates/add-promotion.html",
                        controller: 'addPromotionCtrl'
                    }
                }
            })
            .state('loginown.editpromotion', {
                url: "/editpromotion",
                cache: false,
                reload: true,
                views: {
                    'menuContent': {
                        templateUrl: "templates/edit-promotion.html",
                        controller: 'editPromotionCtrl'
                    }
                }
            })
            .state('logincus.cuspromotionlist', {
                url: "/cuspromotionlist",
                cache: false,
                reload: true,
                views: {
                    'menuContent': {
                        templateUrl: "templates/cus-promotion-list.html",
                        controller: 'cusPromotionListCtrl'
                    }
                }
            })
            .state('loginown.owndepositgeneratecode', {
                url: "/owndepositgeneratecode",
                cache: false,
                reload: true,
                views: {
                    'menuContent': {
                        templateUrl: "templates/own-deposit-generate-code.html",
                        controller: 'ownDepositGenerateCodeCtrl'
                    }
                }
            })
            .state('loginown.owndepositvanselect', {
                url: "/owndepositvanselect",
                cache: false,
                reload: true,
                views: {
                    'menuContent': {
                        templateUrl: "templates/own-deposit-van-select.html",
                        controller: 'ownDepositVanSelectCtrl'
                    }
                }
            })
            .state('loginown.owndepositcodelist', {
                url: "/owndepositcodelist",
                cache: false,
                reload: true,
                views: {
                    'menuContent': {
                        templateUrl: "templates/own-deposit-code-list.html",
                        controller: 'ownDepositCodeListCtrl'
                    }
                }
            })
            .state('loginown.ownremainseat', {
                url: "/ownremainseat",
                cache: false,
                reload: true,
                views: {
                    'menuContent': {
                        templateUrl: "templates/own-remain-seat.html",
                        controller: 'ownRemainSeatCtrl'
                    }
                }
            });

        //Use $urlRouterProvider.otherwise(Url);
        $urlRouterProvider.otherwise(window.globalVariable.startPage.url);

    });
