var ROOT_DIRECTORY_API_SERVICE = "" // feed by main

function graph($http, callback) {
  console.log("graph");

  $http({
    method:   'GET',
    url:      ROOT_DIRECTORY_API_SERVICE + '/dc/graph'
  }).then(function(response) {
    callback(response.data)
  });
};
