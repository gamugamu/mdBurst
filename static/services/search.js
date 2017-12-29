function hl_search_by_tag($http, tag, callback){
  $http({
    method:   'GET',
    url:      ROOT_DIRECTORY_API_SERVICE + '/dc/searchByTags/' + tag
  }).then(function(response) {
    callback(response.data["filesheader"])
  });
}
