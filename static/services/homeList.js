var ROOT_DIRECTORY_API_SERVICE = "" // feed by main

function graph($http) {
  $http({
    method:   'GET',
    url:      ROOT_DIRECTORY_API_SERVICE + '/dc/graph'
  }).then(function(response) {
    console.log(response.data)
  });
};
