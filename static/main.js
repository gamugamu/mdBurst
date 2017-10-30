(function () {

  'use strict';

  angular.module('mdBurst-api', ['ngSanitize'])

  .controller('mdBurst-api-controller', ['$scope','$log', '$http', '$sce',
    function($scope, $log, $http, $sce) {
      var converter             = new showdown.Converter({tables: true, ghCompatibleHeaderId: true, simpleLineBreaks: true, emoji:true});
      showdown.getOptions();

      var defaultOptions        = showdown.getOptions();
      $scope.main_input         = "";
      $scope.main_input_tohmtl  = "";

      $scope.convert_showdown = function(text) {
          text        = $scope.parsetest(text)
          $scope.html = converter.makeHtml(text);
          return $scope.html;
      };

      $scope.$watch('main_input', function() {
          var html = $scope.convert_showdown($scope.main_input)
          $scope.main_input_tohmtl = $sce.trustAsHtml(html);
      }, true);

      $scope.parsetest = function(text) {
        console.log(text)

        if (text.includes("[toc]")){
          console.log("********toc found")

          var lines         = text.split('\n');
          var generated_toc = "<ul>"

          for (var i = 0; i < lines.length; i++) {
            var count = (lines[i].match(/#/g) || []).length;

            if (count > 0){
              //console.log("line: ", i, "count: ", count);
              generated_toc += '<li> <a href="#titre-de-niveau-2">' + lines[i].replace(/#/g, '') + '</a></li>'
              console.log("toc:", generated_toc)
              //console.log("result:", lines[i])
            }
          }
          generated_toc += "</ul>"
          return text.replace("[toc]", generated_toc)

        }else{// endif
          return text;
        }
      }
  }
  ]);

}());
