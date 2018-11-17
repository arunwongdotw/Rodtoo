appControllers.controller('adminPaymentDatetimeSelectCtrl', function($scope, $timeout, $state, $ionicHistory, $mdDialog, $http, myService, $mdSidenav, ionicDatePicker, ionicTimePicker) {
  $scope.queueSelection = {};
  $scope.queueSelection.starttime = "00:00";
  $scope.queueSelection.endtime = "00:00";
  $scope.queueDetail = myService.queueDetail;
  console.log($scope.queueDetail);

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
    $scope.navigateTo('loginadmin.adminpaymentqueueselect');
  };

  var ipObj1 = {
    callback: function(val) { //Mandatory
      // console.log('Return value from the datepicker popup is : ' + val, new Date(val));
      $scope.queueSelection.startdate = new Date(val + 25200000).toISOString().slice(0, 10).replace('T', ' ');
      $scope.queueSelection.startdatetime = $scope.queueSelection.startdate + ' ' + $scope.queueSelection.starttime;
      var str = $scope.queueSelection.startdate;
      var strArray = str.split('-');
      var year = strArray[0];
      var month = strArray[1] - 1;
      var day = strArray[2];
      setFromValueIpObj2(year, month, day);
      getPaymentDetailInQueue();
    },
    from: new Date(2018, 00, 01), //Optional
    to: new Date(2020, 10, 30), //Optional
    inputDate: new Date(), //Optional
    mondayFirst: true, //Optional
    closeOnSelect: false, //Optional
    templateType: 'popup' //Optional
  };

  $scope.openDatePickerStart = function() {
    ionicDatePicker.openDatePicker(ipObj1);
  };

  var ipObj2 = {
    callback: function(val) { //Mandatory
      // console.log('Return value from the datepicker popup is : ' + val, new Date(val));
      $scope.queueSelection.enddate = new Date(val + 25200000).toISOString().slice(0, 10).replace('T', ' ');
      $scope.queueSelection.enddatetime = $scope.queueSelection.enddate + ' ' + $scope.queueSelection.endtime;
      var strArray = str.split('-');
      var year = strArray[0];
      var month = strArray[1] - 1;
      var day = strArray[2];
      setFromValueIpObj1(year, month, day);
      getPaymentDetailInQueue();
    },
    from: new Date(2018, 00, 01), //Optional
    to: new Date(2020, 10, 30), //Optional
    inputDate: new Date(), //Optional
    mondayFirst: true, //Optional
    closeOnSelect: false, //Optional
    templateType: 'popup' //Optional
  };

  $scope.openDatePickerEnd = function() {
    ionicDatePicker.openDatePicker(ipObj2);
  };

  function setFromValueIpObj2(year, month, day) {
    ipObj2 = {
      callback: function(val) { //Mandatory
        // console.log('Return value from the datepicker popup is : ' + val, new Date(val));
        $scope.queueSelection.enddate = new Date(val + 25200000).toISOString().slice(0, 10).replace('T', ' ');
        $scope.queueSelection.enddatetime = $scope.queueSelection.enddate + ' ' + $scope.queueSelection.endtime;
        getPaymentDetailInQueue();
      },
      from: new Date(year, month, day), //Optional
      to: new Date(2020, 10, 30), //Optional
      inputDate: new Date(), //Optional
      mondayFirst: true, //Optional
      closeOnSelect: false, //Optional
      templateType: 'popup' //Optional
    };
  }

  function setFromValueIpObj1(year, month, day) {
    ipObj1 = {
      callback: function(val) { //Mandatory
        // console.log('Return value from the datepicker popup is : ' + val, new Date(val));
        $scope.queueSelection.startdate = new Date(val + 25200000).toISOString().slice(0, 10).replace('T', ' ');
        $scope.queueSelection.startdatetime = $scope.queueSelection.startdate + ' ' + $scope.queueSelection.starttime;
        getPaymentDetailInQueue();
      },
      from: new Date(2018, 00, 01), //Optional
      to: new Date(year, month, day), //Optional
      inputDate: new Date(), //Optional
      mondayFirst: true, //Optional
      closeOnSelect: false, //Optional
      templateType: 'popup' //Optional
    };
  }

  var ipObj3 = {
    callback: function(val) { //Mandatory
      var selectedTime = new Date(val * 1000);
      if (selectedTime.getUTCHours() < 10) {
        if (selectedTime.getUTCMinutes() < 10) {
          $scope.queueSelection.starttime = '0' + selectedTime.getUTCHours() + ':0' + selectedTime.getUTCMinutes();
        } else {
          $scope.queueSelection.starttime = '0' + selectedTime.getUTCHours() + ':' + selectedTime.getUTCMinutes();
        }
      } else {
        if (selectedTime.getUTCMinutes() < 10) {
          $scope.queueSelection.starttime = selectedTime.getUTCHours() + ':0' + selectedTime.getUTCMinutes();
        } else {
          $scope.queueSelection.starttime = selectedTime.getUTCHours() + ':' + selectedTime.getUTCMinutes();
        }
      }
      $scope.queueSelection.startdatetime = $scope.queueSelection.startdate + ' ' + $scope.queueSelection.starttime;
      getPaymentDetailInQueue();
    },
    inputTime: 0, //Optional
    format: 24, //Optional
    step: 15, //Optional
    setLabel: 'Set' //Optional
  };

  $scope.openTimePickerStart = function() {
    ionicTimePicker.openTimePicker(ipObj3);
  };

  var ipObj4 = {
    callback: function(val) { //Mandatory
      var selectedTime = new Date(val * 1000);
      if (selectedTime.getUTCHours() < 10) {
        if (selectedTime.getUTCMinutes() < 10) {
          $scope.queueSelection.endtime = '0' + selectedTime.getUTCHours() + ':0' + selectedTime.getUTCMinutes();
        } else {
          $scope.queueSelection.endtime = '0' + selectedTime.getUTCHours() + ':' + selectedTime.getUTCMinutes();
        }
      } else {
        if (selectedTime.getUTCMinutes() < 10) {
          $scope.queueSelection.endtime = selectedTime.getUTCHours() + ':0' + selectedTime.getUTCMinutes();
        } else {
          $scope.queueSelection.endtime = selectedTime.getUTCHours() + ':' + selectedTime.getUTCMinutes();
        }
      }
      $scope.queueSelection.enddatetime = $scope.queueSelection.enddate + ' ' + $scope.queueSelection.endtime;
      getPaymentDetailInQueue();
    },
    inputTime: 0, //Optional
    format: 24, //Optional
    step: 15, //Optional
    setLabel: 'Set' //Optional
  };

  $scope.openTimePickerEnd = function() {
    ionicTimePicker.openTimePicker(ipObj4);
  };

  function getPaymentDetailInQueue() {
    $http({
      url: myService.configAPI.webserviceURL + 'webservices/getPaymentDetailInQueue.php',
      method: 'POST',
      data: {
        var_queueid: myService.queueDetail.queue_id,
        var_startdatetime: $scope.queueSelection.startdatetime,
        var_enddatetime: $scope.queueSelection.enddatetime
      }
    }).then(function(response) {
      if (response.data.results == "getPaymentDetailInQueue_isZero") {
        $scope.paymentDetail = null;
      } else {
        $scope.paymentDetail = response.data.results[0];
      }
    }, function(error) {
      $mdDialog.show({
        controller: 'DialogController',
        templateUrl: 'confirm-dialog.html',
        locals: {
          displayOption: {
            title: "เกิดข้อผิดพลาด !",
            content: "เกิดข้อผิดพลาด getPaymentDetailInQueue ใน adminPaymentDatetimeSelectController ระบบจะปิดอัตโนมัติ",
            ok: "ตกลง"
          }
        }
      }).then(function(response) {
        ionic.Platform.exitApp();
      });
    });
  }
});
