(function () {
  ROOT_DIRECTORY_API_SERVICE = window.location.origin
  'use strict';

// gère les posts
  angular.module('mdBurst-api', ['ngSanitize'])
  .controller('mdBurst-api-post', ['$scope','$log', '$http', '$sce',
    function($scope, $log, $http, $sce) {
      $scope.main_input         = "";
      $scope.main_input_tohmtl  = "";

      // tranform input to md
      $scope.$watch('main_input', function() {
          var html = cv_convert_showdown($scope.main_input)
          $scope.main_input_tohmtl = $sce.trustAsHtml(html);
      }, true);

      //Drop uploads
      $scope.imageDropped = function(){
          //Get the file
          var fd = new FormData();
          fd.append('file', $scope.uploadedFile);

          $http.post("/upload2", fd,{
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined},
           })
          .success(function (data) {
            $scope.main_input += "\n![](" + data + ")"
          })
          .error(function (error) {
            console.log("error");
          });
      };

      // call API, save post
      $scope.postMD =  function(title, payload){
        $http({
          method:   'POST',
          url:      ROOT_DIRECTORY_API_SERVICE + '/dc/post',
          data: JSON.stringify({
            "title"   : title,
            "payload" : $sce.getTrustedHtml(payload)})
        }).then(function(response) {
          console.log("post excreated");
          console.log(response)
        }); // http
      }// func

    }
  ]);

}());
