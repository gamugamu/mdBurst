(function () {
  ROOT_DIRECTORY_API_SERVICE = window.location.origin
  'use strict';

  angular.module('mdBurst-api', ['ngSanitize'])
  .controller('mdBurst-api-controller', ['$scope','$log', '$http', '$sce',
    function($scope, $log, $http, $sce) {
      var converter             = new showdown.Converter({tables: true, ghCompatibleHeaderId: true, simpleLineBreaks: true, emoji:true});
      $scope.main_input         = "";
      $scope.main_input_tohmtl  = "";
      $scope.graph              = [];

      $(document).ready(function(){
        hl_history($http, function(history_posts){
          console.log("GET history ***", history_posts);
          $scope.posts = history_posts
        }) // graph
      });

      $scope.convert_showdown = function(text) {
          text        = parseMdForToc(text)
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

      $scope.postMD =  function(title, payload){
        console.log("payload", $sce.getTrustedHtml(payload));

        $http({
          method:   'POST',
          url:      ROOT_DIRECTORY_API_SERVICE + '/dc/post',
          data: JSON.stringify({
            "title"   : title,
            "payload" : $sce.getTrustedHtml(payload)})
        }).then(function(response) {
          console.log("post created");
          console.log(response)
        }); // http
      }// func

      $scope.getPayloadMD = function(file_id, tag){
        $scope.getPayloadMD_tag = 0
        if(!$('#'+tag).hasClass('in')){
          timerId = setTimeout(function() {
            function display_wait(tag){
              $scope.getPayloadMD_tag = tag
              $scope.$apply()
              console.log("tag ", tag, $scope, $scope.getPayloadMD_tag);
            };
            display_wait(tag)
          }, 1000);

          $http({
            method:   'POST',
            url:      ROOT_DIRECTORY_API_SERVICE + '/dc/getPayload',
            data: JSON.stringify({"filesid" : [file_id]})
          }).then(function(response) {
            console.log("done");
            hl_feed_graph(response.data[0], $scope.posts);
            $scope.getPayloadMD_tag = 0
            clearTimeout(timerId);
          }); // http
        }
      }// func

      function display_wait(tag){
        $scope.getPayloadMD_tag = tag
      }
    }
  ]);

}());
