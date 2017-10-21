(function () {

  'use strict';

  angular.module('mdBurst-api', [])

  .controller('mdBurst-api-controller', ['$scope', '$log', '$http',
    function($scope, $log, $http) {
      $log.log("launched");


      $scope.convert_showdown = function() {
        $log.log("convert_showdown");

        var converter = new showdown.Converter(),
            text      = '#hello, markdown!',
            html      = converter.makeHtml(text);
        $log.log(html);
      };

      $scope.convert_showdown()
  }
  ]);

}());
