'use strict';

var SpotifyWebApi = require('spotify-web-api-node');

const authorizationCode = 'BQDsDqMPzwdkYfFNIqO91Vcbs0w8kvCZcaHUOoPc41Yl8CbfS7W13H8k_YA1jW-6FdwGMscc0PmQTwEhIsU';

// credentials are optional
var spotifyApi = new SpotifyWebApi({
  clientId: '3210781ce9dd40d8aa95261c18023093',
  clientSecret: 'abf0f74166664dd6ada4914dc465a150',
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