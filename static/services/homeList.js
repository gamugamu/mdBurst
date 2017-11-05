

function homelist_test($http) {
  console.log("will call test***")
  $http.get("https://whispering-woodland-9020.herokuapp.com/getAllBooks")
    .then(function(response) {
      console.log(response.data)
    });
};
