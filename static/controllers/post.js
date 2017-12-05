(function () {
  ROOT_DIRECTORY_API_SERVICE = window.location.origin
  'use strict';

// gère les posts
  angular.module('mdBurst-api', ['ngSanitize'])
  .controller('mdBurst-api-post', ['$scope','$log', '$http', '$sce', '$compile', '$window',
    function($scope, $log, $http, $sce, $compile, $window) {
      $scope.main_input         = "";
      $scope.main_input_tohmtl  = "";
      $scope.post_title         = "";
      $scope.renderTagsHtml     = "";

      $('body').height(100);
      // utils
      $scope.range = function(count){
        return new Array(+count);
      };

      $scope.category_selected = function(row, column){
        console.log("uu", row, column);
        $scope.post_next_step(1);
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

      // call API, save post
      var counter_step = 0;
      $scope.post_next_step = function(step){
        counter_step += step;
        steps         = ["post_confirm_step_1", "post_confirm_step_2"];
        var post_btn  = document.getElementById("post_btn");
        console.log("****", counter_step);
        // no steps
        if (counter_step <= -1){
          var element = document.getElementById("confirm_post");
          element.style.display   = "none";
          post_btn.style.display  = "block";

        }else if (counter_step >= 2){
          counter_step = 1;
          $scope.postMD($scope.post_title, $scope.main_input)
        }
        else {
            var element = document.getElementById("confirm_post");
            element.style.display   = "block";
            post_btn.style.display  = "none";

            // clean all display
            for(var elm in steps){
              var element           = document.getElementById(steps[elm]);
              element.style.display = "none";
            }
            // display only revelant step
            var element = document.getElementById(steps[counter_step]);
          //  console.log(element);
            element.style.display = "block";
          }
      }// func

      // tag
      $scope.add_tag = function(){
        var text = $sce.trustAsHtml(tag_button($scope.tag_value));
        var myEl = angular.element(document.querySelector('#renderTags'));
        myEl.append(tag_button($scope.tag_value, $window.document.getElementsByClassName("tag_deletable").length))
        $compile(myEl.contents())($scope);
      };

      function tag_button(tag, idx){
        return '<span class="mdl-chip mdl-chip--deletable tag_deletable" id=tag_' + parseInt(idx, 10) + '>' +
               '<span class="mdl-chip__text">' + tag + '</span>' +
               '<button ng-click="tag_delete('+ idx + ')" ng-value=' + tag + 'type="button" class="mdl-chip__action"><i class="material-icons">cancel</i></button></span>'
      };

      $scope.tag_delete = function(tag){
          var myEl = angular.element( document.querySelector( '#tag_'+ tag ) );
          myEl.remove();
      }

      // call API, save post
      $scope.postMD = function(title, payload){
        console.log("RESULT", $scope.main_input, $scope.post_title);

        if ($scope.main_input == "" && $scope.post_title == "") {
          var dialog = document.querySelector('dialog');

          if (! dialog.showModal) {
            dialogPolyfill.registerDialog(dialog);
          }
          dialog.showModal();
          dialog.querySelector('.close').addEventListener('click', function() {
              dialog.close();
          });
        }else{
          $http({
            method:   'POST',
            url:      ROOT_DIRECTORY_API_SERVICE + '/dc/post',
            data: JSON.stringify({
              "title"   : title,
              "payload" : $sce.getTrustedHtml(payload)})
          }).then(function(response) {
            // redirection homePage. le post doit être en haut de liste.
            $scope.navigateTo()
          }); // http
        } // if
      }// func

      $scope.navigateTo = function(uri = ""){
        window.location.replace(window.location.origin + uri);
      }

      $scope.renderHtml = function (htmlCode) {
          return $sce.trustAsHtml(htmlCode);
      };

      $scope.post_next_step(-1); // affichage par défault
    }
  ]);

}());
