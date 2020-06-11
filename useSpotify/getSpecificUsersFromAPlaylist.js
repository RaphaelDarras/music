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

var identifier = process.argv.slice(2);

spotifyApi
    .clientCredentialsGrant(authorizationCode)
    .then(data => {    
        spotifyApi.setAccessToken(data.body['access_token']);
        return getOnePlaylistInfos(identifier);
    })
    .then(playlist => getAllArtistsOnPlaylist(playlist.body))
    .then(artists => removeDoubleArtists(artists))
    .then(noDoubleArtists => getArtists(noDoubleArtists))
    .then(artistsDetails => removeUnpopularArtists(artistsDetails))
    .then(artistsDetails => removeTooPopularArtists(artistsDetails))
    .then(popularArtists => removeArtistsWithTooFewFollowers(popularArtists))
    .then(popularArtists => removeArtistsWithTooMuchFollowers(popularArtists))
    .then(selectedArtists => getSelectedArtistsNames(selectedArtists))
    .then(data => console.log(data))
    .catch((err) => console.log(err));
;

// - Trouver toutes les playlists des artistes restants
// - Garder que les playlist avec plus de Z followers
// 

function getArtists(artists){
    const spotifyLimit = 50;
    const promises = [];
    const partitionnedArray = partition(artists, spotifyLimit);
    for(let slice in partitionnedArray){
        promises.push(spotifyApi.getArtists(slice));
    }

    return Promise.all(promises).then(values => values.flat());
}

// Détruit pas
/**
 * @return [[artists]]
 */
function splitarray(input, spacing){
    var output = [];
    for (var i = 0; i < input.length; i += spacing){
        output[output.length] = input.slice(i, i + spacing);
    }
    return output;
}

// Détruit l'input
/**
 * @input - array - tableau d'artiste
 * @input - n - limit
 * @returns [[artists]]
 */
function partition(array, n) {
    return array.length ? [array.splice(0, n)].concat(partition(array, n)) : [];
}  


function getOnePlaylistInfos(playlistID) {
    return spotifyApi.getPlaylist(playlistID);
}

function getAllArtistsOnPlaylist(playlistDetails) {
    var artists = [];
    playlistDetails.tracks.items.forEach(track => {
        artists.push(track.track.artists[0].id);
    });
    return artists;
}

function removeDoubleArtists(artists) {        
    var artistsNoDouble = artists.reduce((noDouble, artist) => 
        noDouble.includes(artist) ? noDouble : [...noDouble, artist], 
        []
    );    
    return artistsNoDouble;
}

function removeUnpopularArtists(artistsDetails) { 
    var popularArtists = artistsDetails.body.artists.reduce((unpopular, artist) => 
        artist.popularity <= 20 ? unpopular : [...unpopular, artist], 
        []
    );  
    return popularArtists;
}

function removeTooPopularArtists(artistsDetails) {     
    var popularArtists = artistsDetails.reduce((unpopular, artist) => 
        artist.popularity >= 25 ? unpopular : [...unpopular, artist], 
        []
    );  
    return popularArtists;
}


function removeArtistsWithTooFewFollowers(popularArtists) {
    var followedArtists = popularArtists.reduce((followed, artist) => 
        artist.followers.total <= 100 ? followed : [...followed, artist],
        []
    );
    return followedArtists;
}

function removeArtistsWithTooMuchFollowers(popularArtists) {
    var followedArtists = popularArtists.reduce((followed, artist) => 
        artist.followers.total >= 5000 ? followed : [...followed, artist],
        []
    );
    return followedArtists;
}

function getSelectedArtistsNames(selectedArtists) {
    var artistsNames = []
    selectedArtists.forEach(artist => artistsNames.push(artist.name))

    return artistsNames;
}
