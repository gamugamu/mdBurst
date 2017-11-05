var ROOT_DIRECTORY_API_SERVICE = "" // feed by main
AKEY    = 'd872eebd3967a9a00bdcb7235b491d87'
iv      = 'key-directoryAPI'

var enc = new TextEncoder("utf-8");

var key = CryptoJS.enc.Hex.parse(AKEY);
var iv  = CryptoJS.enc.Hex.parse(iv);

function encrypt(message) {
  return CryptoJS.AES.encrypt(message, AKEY, {mode: CryptoJS.mode.CFB, iv: iv});
}

function decrypt(crypto) {
  return CryptoJS.AES.decrypt(crypto, key.toString(), {mode: CryptoJS.mode.CFB, iv: iv.toString()}).toString(CryptoJS.enc.Utf8);
}

var format_ex = "d872eebd3967a9a00bdcb7235b491d87|2017-11-05_16:37:47"
var ex_result = "I7mHCIWiwTyyct50ENCkIHjGDcLfSQ3CT4HVkAYDtT63Pe9YC2MX3GoJmmEdjAl350T7lA=="

var apirequestkey = encrypt(AKEY + "|" + "date")
console.log("test", window.btoa("test"));

console.log("encrypt", window.btoa(encrypt(format_ex)), "result", ex_result);

//var decodedData = window.atob(encodedData);



//console.log("decrypt", decrypt("I7mHCIWiwTyyct50ENCkIHjGDcLfSQ3CT4HVkAYDtT63Pe9YC2MX3GoJmmEdjAl35FJb8A=="));
var headers_requestToken = {'content-type': 'application/json', 'token-request' : apirequestkey}

function homelist_test($http) {
  console.log("will call test***")

  $http({
    method: 'GET',
    url: ROOT_DIRECTORY_API_SERVICE + '/asktoken',
    headers: {
        'Accept': 'application/json',
        "token-request": apirequestkey
    }
  }).then(function(response) {
    console.log(response.data)
  });
/*
  $http.get(ROOT_DIRECTORY_API_SERVICE + "/rest/0.0.2/")
    .then(function(response) {
      console.log(response.data)
    });
    */
};
