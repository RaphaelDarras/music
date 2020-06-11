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
        return getOneArtistsPlaylists(identifier);
    })
    .then(artistInfos => console.log(artistInfos.body.playlists.items))
    .catch((err) => console.log(err));

function getOneArtistsPlaylists(artist) {    
    return spotifyApi.searchPlaylists(artist);
}