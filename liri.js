require("dotenv").config();
var Spotify = require('node-spotify-api');
var fs = require("fs");
var keys = require("./keys.js");
var axios = require("axios");
var spotify = new Spotify(keys.spotify);
var userInput = process.argv.slice(3).join(" ");
var parg = process.argv[2]


function liriCmds() {
    if (parg === "concert-this") {

        if (!userInput) {
            console.log("You didn't specify a band!");
            return;
        }

        var bandsQueryUrl = "https://rest.bandsintown.com/artists/" + userInput + "/events?app_id=codingbootcamp";
        axios.get(bandsQueryUrl).then(
            function (response) {
                // I want to add a way to choose the number of responses
                console.log("Venue: " + response.data[0].venue.name);
                console.log("Location: " + response.data[0].venue.city + ", " + response.data[0].venue.region);
                // Need to use moment to fix the date
                console.log("Date of Event: " + response.data[0].datetime);
            }
        );

    } else if (parg === "spotify-this-song") {

        if (!userInput) {
            userInput = "the Sign"
            spotify
            .search({
                type: 'track',
                query: userInput
            })
            .then(function (response) {
                console.log("Band/Artist Name: " + response.tracks.items[9].artists[0].name);
                console.log("Song Name: " + response.tracks.items[9].name);
                console.log("Album Name: " + response.tracks.items[9].album.name)
                console.log("Preview URL: " + response.tracks.items[9].preview_url)
            })
            .catch(function (err) {
                console.log(err);
            });

        } else {

        spotify
            .search({
                type: 'track',
                query: userInput
            })
            .then(function (response) {
                console.log("Band/Artist Name: " + response.tracks.items[0].artists[0].name);
                console.log("Song Name: " + response.tracks.items[0].name);
                console.log("Album Name: " + response.tracks.items[0].album.name)
                console.log("Preview URL: " + response.tracks.items[0].preview_url)
            })
            .catch(function (err) {
                console.log(err);
            });
        }

    } else if (parg === "movie-this") {

        if (!userInput) {
            userInput = "Mr. Nobody"
        }

        var movieQueryUrl = "http://www.omdbapi.com/?t=" + userInput + "&y=&plot=short&apikey=trilogy";
        axios.get(movieQueryUrl).then(
            function (response) {
                // I'd like to add a way to not include results that aren't included in OMDB response
                console.log("Title: " + response.data.Title);
                console.log("Release Year: " + response.data.Year);
                console.log("IMDB Rating: " + response.data.Ratings[0].Value);
                console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
                console.log("Country: " + response.data.Country);
                console.log("Language: " + response.data.Language);
                console.log("Plot: " + response.data.Plot);
                console.log("Cast: " + response.data.Actors);
            }
        );

    } else {
        console.log("I don't understand, please enter a valid command.");
    }
}

if (parg === "do-what-it-says") {

    fs.readFile("random.txt", "utf8", function (error, data) {

        if (error) {
            return console.log(error);
        }

        var dataArr = data.split("; ");
        var cmdArr = dataArr[1].split(",");
        parg = cmdArr[0];
        userInput = cmdArr[1];
        // console.log(parg);
        // console.log(userInput);
        liriCmds()
    })
} else {
    liriCmds()
}