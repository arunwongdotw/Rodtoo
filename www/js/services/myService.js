angular.module('starter')
  // .service('notifyService', function($http, $q) { // สร้าง service
  //   // กำหนด url ของ ไฟล์ api ของเรา
  //   var url = "http://1did.net/rodtoo/php_push/token.php";
  //   return { // ในที่นี้เราจะใช้การส่งค่าแบบ post
  //     setNotify: function(dataSend) {
  //       var deferred = $q.defer();
  //       $http.post(url, dataSend)
  //         .success(deferred.resolve)
  //         .error(deferred.reject);
  //       return deferred.promise;
  //     },
  //     updateNotify: function(dataSend) {
  //       var deferred = $q.defer();
  //       $http.post(url, dataSend)
  //         .success(deferred.resolve)
  //         .error(deferred.reject);
  //       return deferred.promise;
  //     }
  //   };
  // })

  .service('myService', function() {
    this.configAPI = {
      version: '@testapp v0.0.1',
      webserviceURL: 'http://1did.net/rodtoo/'
    };

    this.memberDetailFromLogin = {}; // obj เก็บข้อมูล member จากการ login
    this.bookingDetail = {};
    this.bookingIDInList = {};
    this.vanIDInList = {};
    this.editVan = {};
    this.editPoint = {};
    this.editGetIn = {};
    this.editPromotion = {};
    this.vanDetail = {};
    this.queueDetail = {};
    this.inputDialog = {}; // object เก็บข้อมูล input จาก input dialog
  });
