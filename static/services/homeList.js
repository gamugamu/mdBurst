var ROOT_DIRECTORY_API_SERVICE = "" // feed by main

function homelist($http) {
  var $http_ = $http

  $http_({
    method: 'GET',
    url: ROOT_DIRECTORY_API_SERVICE + '/dc/generateAPIKey'
  }).then(function(response) {
      var token = response.data
      graph($http, token)
  });
};


function graph($http, token) {
  $http({
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'token-request': token
    },
    data: {"file_id" : ""},
    url: ROOT_DIRECTORY_API_SERVICE + '/dc/graph'
  }).then(function(response) {
    console.log(response.data)
  });
};
