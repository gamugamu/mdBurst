(function () {

  'use strict';

  angular.module('mdBurst-api', ['ngSanitize'])

  .controller('mdBurst-api-controller', ['$scope','$log', '$http', '$sce',
    function($scope, $log, $http, $sce) {
      var toc                   = require('markdown-toc');
      var converter             = new showdown.Converter({/*extensions: ['toc'],*/ tables: true, ghCompatibleHeaderId: true, simpleLineBreaks: true, emoji:true});
      showdown.getOptions();

      var defaultOptions        = showdown.getOptions();
      $scope.main_input         = "";
      $scope.main_input_tohmtl  = "";

      $scope.convert_showdown = function(text) {
          $scope.html = converter.makeHtml(text);
          return $scope.html;
      };

      $scope.$watch('main_input', function() {
          var html = $scope.convert_showdown($scope.main_input)
          $scope.main_input_tohmtl = $sce.trustAsHtml(html);
      }, true);

      $scope.test = function(text) {
        //  text = text.replace(/\r?\n/g, '')
          console.log("test")

      };
  }
  ]);

}());
