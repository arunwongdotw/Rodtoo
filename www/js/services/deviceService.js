appControllers.service('deviceService', function($http, $ionicPopup, $rootScope, $cordovaNetwork, $cordovaGeolocation, $cordovaLaunchNavigator, $ionicLoading, $cordovaDevice) {
  var me = this;

  // this.configAPI = {
  //   version: '@senchabox v0.0.1',
  //   webserviceURL: 'http://1did.net/centerapp/webservices'
  //   //webserviceURL:'http://localhost/www_web_api'
  // };

  // Recursive Function
  this.setMarkerInfo = function(map, mapArray, callback) {
    if (mapArray.length > 0) {
      var position = mapArray.shift();
      var latLng = new google.maps.LatLng(position.latitude, position.longitude);

      var marker = new google.maps.Marker({
        map: map,
        animation: google.maps.Animation.DROP,
        position: latLng,
        icon: 'img/pokemon_ball.png'
      });

      this.getLocationInformation(position, function(address) {
        var infoWindow = new google.maps.InfoWindow({
          content: "ปักหมุด<br>" +
            "Lat : " + position.latitude +
            "<br>" +
            "Lng : " + position.longitude +
            "<br>" + address
        });

        google.maps.event.addListener(marker, 'click', function() {
          infoWindow.open(map, marker);
        });

        me.setMarkerInfo(map, mapArray, callback);
      });
    } else {
      // Success Recursive Function
      callback();
    }
  };

  //Check Device Connection
  this.checkInternet = function() {
    // listen for Online event
    $rootScope.$on('$cordovaNetwork:online', function(event, networkState) {
      $ionicPopup.alert({
        title: 'Internet Connection',
        template: 'Online : ' + networkState
      });
    });

    // listen for Offline event
    $rootScope.$on('$cordovaNetwork:offline', function(event, networkState) {
      $ionicPopup.alert({
        title: 'Internet Connection',
        template: 'Offline'
      });
    });
  };

  //Check Online
  this.checkOnline = function(callback) {
    var isOnline = $cordovaNetwork.isOnline();
    if (isOnline) {
      // Return callback()
      callback('online');
    } else {
      $ionicPopup.alert({
        title: 'Internet Connection',
        template: 'Offline'
      });
      // Return callback()
      callback('offline');
    }
  };

  //Check GPS On/Off
  this.checkGPS = function(callback) {
    cordova.plugins.diagnostic.isLocationEnabled(function(enabled) {
      console.log("Location setting is " + (enabled ? "enabled" : "disabled"));
      if (enabled) {
        // Return callback()
        callback('GPS_ON');
      } else {
        // Return callback()
        callback('GPS_OFF');
      }
    }, function(error) {
      console.log("The following error occurred: " + error);
    });

  };

  // Open Location Setting
  this.openSetting = function(callback) {
    cordova.plugins.settings.open("location", function() {
      console.log('opened location settings');
      callback('OPENED_SETTING');
    }, function() {
      console.log('failed to open location settings');
      callback('FAILED_SETTING');
    });
  };

  // Get Current Location
  this.currentLocation = function(callback) {
    $ionicLoading.show();

    var options = {
      timeout: 10000,
      enableHighAccuracy: true
    };

    $cordovaGeolocation.getCurrentPosition(options).then(function(position) {
      console.log('==== Plugin GPS Active ====');
      console.log(position.coords.latitude, position.coords.longitude);
      $ionicLoading.hide();
      // Return callback()
      callback(position.coords);
    }, function(error) {
      console.log("Could not get location");
      $ionicPopup.alert({
        title: 'ผิดพลาด',
        template: 'ไม่สามารถรับสัญญาณดาวเทียมได้ กรุณากดปุ่ม Refresh มุมขวาบน'
      });
      $ionicLoading.hide();
      // Return callback()
      callback('ERROR_POSITION');
    });
  };

  // Launch Native Map
  this.launchMap = function(start, destination) {
    var destination = [destination.latitude, destination.longitude];
    var start = start.latitude + "," + start.longitude;
    launchnavigator.navigate(destination, {
      start: start
    });
  };

  //Check Platform
  this.checkPlatform = function(callback) {
    //GET PLATFORM
    var platform = $cordovaDevice.getPlatform();
    // ANDROID
    if ((platform == 'Android') || (platform == 'android')) {
      // Return callback()
      callback('android');
    } else if (platform == 'iOS') {
      // iOS
      // Return callback()
      callback('ios');
    } else {
      console.log('Unknown Device');
      // Return callback()
      callback('unknown');
    }
  };

  // Force Android GPS
  this.androidGpsSetting = function(callback) {
    cordova.plugins.locationAccuracy.request(function(success) {
      console.log("Successfully requested accuracy: " + success.message);
      // Return callback()
      callback('force_gps');
    }, function(error) {
      console.log("Accuracy request failed: error code=" + error.code + "; error message=" + error.message);
      if (error.code !== cordova.plugins.locationAccuracy.ERROR_USER_DISAGREED) {
        // Return callback()
        callback('setting_gps');
      }
    }, cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);
  };

  // Google information
  this.getLocationInformation = function(position, callback) {
    var urlLocationInfo = "https://maps.googleapis.com/maps/api/geocode/json?language=th&latlng=" + position.latitude + "," + position.longitude + "&sensor=false&key=AIzaSyCZDic_rNipmZn_pMbc7wpuH6JgBlikbqM";
    $http.get(urlLocationInfo).then(function(resp) {
      var address_info = resp.data.results[0].formatted_address;
      // Return callback()
      callback(address_info);
    }, function(err) {
      console.log('ERR', err);
      // Return callback()
      callback('error_information');
    });
  };
});
