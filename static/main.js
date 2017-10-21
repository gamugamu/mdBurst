(function () {

  'use strict';

  angular.module('mdBurst-api', ['ngSanitize'])

  .controller('mdBurst-api-controller', ['$scope', '$log', '$http',
    function($scope, $log, $http) {
      var converter = new showdown.Converter({tables: true});
      $scope.main_input = "";
      $scope.main_input_tohmtl = "#hello, markdown!";

      $scope.convert_showdown = function(text) {
          //text = text.replace(/\r?\n/g, '')
          $log.log(text);

          return converter.makeHtml(text);
      };

      $scope.$watch('main_input', function() {
        $scope.main_input_tohmtl = $scope.convert_showdown($scope.main_input);
      }, true);
  }
  ]);

}());
