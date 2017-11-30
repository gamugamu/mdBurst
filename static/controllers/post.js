(function () {
  ROOT_DIRECTORY_API_SERVICE = window.location.origin
  'use strict';

// gère les posts
  angular.module('mdBurst-api', ['ngSanitize'])
  .controller('mdBurst-api-post', ['$scope','$log', '$http', '$sce',
    function($scope, $log, $http, $sce) {
      $scope.main_input         = "";
      $scope.main_input_tohmtl  = "";

      $('body').height(100);
      // utils
      $scope.range = function(count){
        console.log("iteratiob");
        return new Array(+count);
      };
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

      var counter = 0;
      // call API, save post
      $scope.post_next_step = function(step){
        console.log(counter);
        counter += step;
        steps = ["post_confirm_step_1", "post_confirm_step_2"];
        // no steps
        if (counter == -1){
          var element = document.getElementById("confirm_post");
          element.style.display = "none";
        }else if (counter >= 2){
          counter = 1;
          $scope.postMD($scope.post_title, $scope.main_input)
        }
        else {
            var element = document.getElementById("confirm_post");
            element.style.display = "block";
            // clean all display
            for(var elm in steps){
              var element           = document.getElementById(steps[elm]);
              element.style.display = "none";
            }
            // display only revelant step
            var element           = document.getElementById(steps[counter]);
          //  console.log(element);
            element.style.display = "block";
          }
      }// func

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
          // redirection homePage. le post doit être en haut de liste.
          $scope.navigateTo()
        }); // http
      }// func

      $scope.navigateTo = function(uri = ""){
        window.location.replace(window.location.origin + uri);
      }
    }
  ]);

}());
