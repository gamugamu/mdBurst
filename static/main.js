(function () {

  ROOT_DIRECTORY_API_SERVICE = "http://127.0.0.1:8000/rest/0.0.2"
  'use strict';

  angular.module('mdBurst-api', ['ngSanitize'])

  .controller('mdBurst-api-controller', ['$scope','$log', '$http', '$sce',
    function($scope, $log, $http, $sce) {
      var converter = new showdown.Converter({tables: true, ghCompatibleHeaderId: true, simpleLineBreaks: true, emoji:true});

      var defaultOptions        = showdown.getOptions();
      $scope.main_input         = "";
      $scope.main_input_tohmtl  = "";

      $scope.convert_showdown = function(text) {
          text        = parsetest(text)
          $scope.html = converter.makeHtml(text);
          return $scope.html;
      };

      $scope.$watch('main_input', function() {
          var html = $scope.convert_showdown($scope.main_input)
          $scope.main_input_tohmtl = $sce.trustAsHtml(html);
      }, true);

      homelist_test($http)
  }
  ]);

}());
