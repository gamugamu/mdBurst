(function () {
  ROOT_DIRECTORY_API_SERVICE = window.location.origin
  'use strict';

  angular.module('mdBurst-api', ['ngSanitize'])
  .controller('mdBurst-api-controller', ['$scope','$log', '$http', '$sce', '$location',
    function($scope, $log, $http, $sce, $location) {
      var converter             = new showdown.Converter({tables: true, ghCompatibleHeaderId: true, simpleLineBreaks: true, emoji:true});
      $scope.main_input         = "";
      $scope.main_input_tohmtl  = "";
      $scope.graph              = [];
      $scope.current_page       = 1; // permet de connaitre la page en cours

      $scope.$history = function($http, current_page){
        hl_history($http, current_page, function(history_posts, iterator){
          $scope.posts          = history_posts
          $scope.page_iterator  = iterator
          console.log("refresh", history_posts, iterator);
        })
      };
/*
      $(window).load(function() {
        console.log("window");
        $scope.$history($http, $scope.current_page);

      });
*/
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

      $scope.$watch(function(){
          return $location.path();
      }, function(value){
          new_page = value.replace( /^\D+/g, '')
          $scope.$history($http, new_page - 1); // index commence à 0. Contrairement à la pagination
      });

      // GUI
      function display_wait(tag){
        $scope.getPayloadMD_tag = tag
      }
    }
  ]);

}());
