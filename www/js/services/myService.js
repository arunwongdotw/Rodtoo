angular.module('starter')
  .service('myService', function() {
    this.configAPI = {
      version: '@testapp v0.0.1',
      webserviceURL: 'http://1did.net/rodtoo/'
    };

    this.memberDetailFromLogin = {}; // obj เก็บข้อมูล member จากการ login
    this.bookingDetail = {};
    this.bookingIDInList = {};
    this.editVan = {};
  });
