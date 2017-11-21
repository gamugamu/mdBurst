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

      // appel la liste des dernier posts
      $(document).ready(function(){
        hl_history($http, function(history_posts, iterator){
          $scope.posts = history_posts
          console.log("iterator-->", iterator);
        }) // graph
      });

      // récupère le détail du post
      $scope.getPayloadMD = function(file_id, tag, idx){
        $scope.getPayloadMD_tag = 0

        if(!$('#'+tag).hasClass('in') && $scope.posts[idx].payload == ""){
          timerId = setTimeout(function() {
            function display_wait(tag){
              $scope.getPayloadMD_tag = tag
              $scope.$apply()
            };
            display_wait(tag)
          }, 1000);

          // call API
          $http({
            method:   'POST',
            url:      ROOT_DIRECTORY_API_SERVICE + '/dc/getPayload',
            data: JSON.stringify({"filesid" : [file_id]})
          }).then(function(response) {
            hl_feed_graph(response.data[0], $scope.posts,
              function(index) {
                $scope.posts[index].payload = cv_convert_showdown($scope.posts[index].payload)
              }
            );
            $scope.getPayloadMD_tag = 0 // flag :(
            clearTimeout(timerId);
          }); // http
        }
      }// func

      // GUI
      function display_wait(tag){
        $scope.getPayloadMD_tag = tag
      }
    }
  ]);

}());
