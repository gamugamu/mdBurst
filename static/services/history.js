function hl_history($http, current_page, callback){
  $http({
    method:   'POST',
    url:      ROOT_DIRECTORY_API_SERVICE + '/dc/history',
    data:     {"current_page" : current_page}
  }).then(function(response) {
    callback(response.data["history"], response.data["iterator"])
  });
}
