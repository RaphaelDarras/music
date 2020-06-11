'use strict';

var SpotifyWebApi = require('spotify-web-api-node');
var credentials = require('./credentials');

const authorizationCode = credentials.authorizationCode;

// credentials are optional
var spotifyApi = new SpotifyWebApi({
    clientId: credentials.clientId,
    clientSecret: credentials.clientSecret,
  redirectUri: 'http://localhost:8888/callback'
});

var userID = process.argv.slice(2);

spotifyApi
    .clientCredentialsGrant(authorizationCode)
    .then(data => {    
        spotifyApi.setAccessToken(data.body['access_token']);
        return spotifyApi.getUserPlaylists(userID);
    })
    .then(userPlaylists => console.log(userPlaylists))
    .catch((err) => console.log(err))
;
