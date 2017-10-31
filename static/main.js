(function () {

  'use strict';

  var app = angular.module('mdBurst-api', ['ngSanitize', 'ui.imagedrop'])

  .controller('mdBurst-api-controller', ['$scope','$log', '$http', '$sce',
    function($scope, $log, $http, $sce) {
      var converter             = new showdown.Converter({tables: true, ghCompatibleHeaderId: true, simpleLineBreaks: true, emoji:true});
      showdown.getOptions();

      var defaultOptions        = showdown.getOptions();
      $scope.main_input         = "";
      $scope.main_input_tohmtl  = "";

      app.config(['$interpolateProvider', function($interpolateProvider) {
        $interpolateProvider.startSymbol('{a');
        $interpolateProvider.endSymbol('a}');
        console.log("interpolateProvider", file)
      }]);

      $scope.convert_showdown = function(text) {
          text        = parsetest(text)
          $scope.html = converter.makeHtml(text);
          return $scope.html;
      };

      $scope.$watch('main_input', function() {
          var html = $scope.convert_showdown($scope.main_input)
          $scope.main_input_tohmtl = $sce.trustAsHtml(html);
      }, true);

      //Drop uploads
      $scope.imageDropped = function(){
          //Get the file
          var file = $scope.uploadedFile;
          console.log("imageDropped", file)
          var fd = new FormData();
          fd.append('file', file);
          console.log("fd", fd.get('file'))


          $http.post("/upload2", fd,{
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined},
           })
          .success(function (data) {
            console.log("success data");
          })
          .error(function (error) {
            console.log("error");
          });
      };
  }
  ]);

}());
