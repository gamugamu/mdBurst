function hl_history($http, callback){
  $http({
    method:   'POST',
    url:      ROOT_DIRECTORY_API_SERVICE + '/dc/history'
  }).then(function(response) {
    callback(response.data)
  });
}
