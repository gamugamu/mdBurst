(function () {

  'use strict';

  angular.module('mdBurst-api', [])

  .controller('mdBurst-api-controller', ['$scope', '$log', '$http',
    function($scope, $log, $http) {
      $log.log("launched");

    $scope.perform_api_test = function() {
      $http.post('/starttest').
        success(function(results) {
          $log.log(results);
        }).
        error(function(error) {
          $log.log(error);
        });
    };
  }
  ]);

}());
