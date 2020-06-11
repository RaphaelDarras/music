'use strict';

var SpotifyWebApi = require('spotify-web-api-node');

const authorizationCode = credentials.authorizationCode;
var credentials = require('./credentials');

// credentials are optional
var spotifyApi = new SpotifyWebApi({
    clientId: credentials.clientId,
    clientSecret: credentials.clientSecret,
  redirectUri: 'http://localhost:8888/callback'
});

var identifier = process.argv.slice(2);

spotifyApi
    .clientCredentialsGrant(authorizationCode)
    .then(data => {    
        spotifyApi.setAccessToken(data.body['access_token']);
        return getOneArtistsInfos(identifier);
    })
    .then(artistInfos => console.log(artistInfos.body.popularity))
    .catch((err) => console.log(err));

function getOneArtistsInfos(artist) {
    return spotifyApi.getArtist(artist);
}