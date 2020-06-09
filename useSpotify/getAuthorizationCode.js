'use strict';

var SpotifyWebApi = require('spotify-web-api-node');


var clientId = '3210781ce9dd40d8aa95261c18023093',
clientSecret = 'abf0f74166664dd6ada4914dc465a150';

// Create the api object with the credentials
var spotifyApi = new SpotifyWebApi({
clientId: clientId,
clientSecret: clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant().then(
function(data) {
  console.log('The access token expires in ' + data.body['expires_in']);
  console.log('The access token is ' + data.body['access_token']);

  // Save the access token so that it's used in future calls
  spotifyApi.setAccessToken(data.body['access_token']);
},
function(err) {
  console.log('Something went wrong when retrieving an access token', err);
}
);