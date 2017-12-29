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
      $scope.current_page       = 0; // permet de connaitre la page en cours
      $scope.current_location   = "";

      var page_auto_refresh     = document.getElementById("pagination_autorefresh"); // auto refresh pagination

      $(window).ready(function() {
        $scope.current_location = $location.path();
        $scope.$history($http, $scope.current_page);
      });

      document.addEventListener("DOMContentLoaded", function(event) {
              // - Code to execute when all DOM content is loaded.
              // - including fonts, images, etc.
              console.log("loaded+++++");
      });

      // pour l'auto-refresh des pages lorsque l'on est en bas de page.
      $(document).scroll(function(){
        if( isScrolledIntoView(page_auto_refresh) == true &&
            page_auto_refresh.style.display != "none"){

            // evite de réappler cette fonction pendant un appel.
            page_auto_refresh.style.display = "none";
            $scope.current_page += 1;

            $scope.$history($http, $scope.current_page, need_appending=true, function(){
              page_auto_refresh.style.display = "block";
            });
        }
      });

      $scope.$history = function($http, current_page, need_appending=false, completion=null){
        if ($scope.page_iterator == undefined ||
            $scope.page_iterator.max_iteration > current_page){
              hide_display_loader(true)

              hl_history($http, current_page, function(history_posts, iterator){
                // append ou refresh les posts
                if (need_appending == true)
                  $scope.posts.push.apply($scope.posts, history_posts);
                else
                  $scope.posts = history_posts

                $scope.page_iterator      = iterator
                hide_display_loader(false)

                // callback
                if (completion != null){
                  completion()
                }
          })
        }
      };

      $scope.searchByTag = function () {
        if($scope.tag  === undefined || $scope.tag === ""){
          $scope.page_iterator  = undefined;
          $scope.current_page   = 0;
          $scope.$history($http, $scope.current_page);
        }else{
          $scope.$search($http, $scope.tag);
        }
      }

      $scope.$search = function($http, tag){
          hide_display_loader(true)
          $scope.current_page   = 0; // clean up all the history graph.
          $scope.page_iterator  = 0

          hl_search_by_tag($http, tag, function(tagged_posts){
                // append ou refresh les posts
                $scope.posts = tagged_posts

                hide_display_loader(false)
          }) // hl_history
      };

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
         if ($scope.current_location != value){
            new_page = value.replace( /^\D+/g, '');
            $scope.current_location = value;
            $scope.$history($http, new_page - 1); // index commence à 0. Contrairement à la pagination
          }
      });

      // GUI
      function display_wait(tag){
        $scope.getPayloadMD_tag = tag
      }

      function hide_display_loader(should_display){
        var page_loader           = document.getElementById("pagination_loader"); // auto refresh pagination
        if(should_display == true){
          page_loader.style.display = "block";
        }else{
          page_loader.style.display = "none";
        }
      }

      function isScrolledIntoView(elm) {
        var elemTop     = elm.getBoundingClientRect().top;
        var elemBottom  = elm.getBoundingClientRect().bottom;

        return (elemTop >= 0) && (elemBottom <= window.innerHeight);
      }
    }
  ]);

}());
