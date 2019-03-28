require("dotenv").config();
var Spotify = require('node-spotify-api');
var fs = require("fs");
var keys = require("./keys.js");
var axios = require("axios");
var inquirer = require("inquirer");
var moment = require("moment");
var spotify = new Spotify(keys.spotify);
var userInput = process.argv.slice(3).join(" ");
var parg = process.argv[2]
var divider = "\n----------------\n"

function liriCmds() {

    switch (parg) {
        case "concert-this":
            if (!userInput) {
                console.log("You didn't specify a band!");
                fs.appendFile("log.txt", "concert-this\n" + "You didn't specify a band!" + divider, function (err) {
                    if (err) throw err;
                })
                return;
            }
            inquirer.prompt([{
                type: "list",
                name: "concertNum",
                message: "How many would you like to see?",
                choices: ["1", "2", "3", "4", "5"]
            }]).then(function (answer) {

                var cNum = parseInt(answer.concertNum)

                var bandsQueryUrl = "https://rest.bandsintown.com/artists/" + userInput + "/events?app_id=codingbootcamp";
                axios.get(bandsQueryUrl).then(function (response) {

                    for (var i = 0; i < cNum; i++) {
                        var concertData = `Venue: ${response.data[i].venue.name}\nLocation: ${response.data[i].venue.city + ", " + response.data[i].venue.region}\nDate of Event: ${moment(response.data[i].datetime).format("MMMM Do YYYY, ha")}${divider}`
                        console.log(concertData)
                        fs.appendFile("log.txt", `concert-this\n ${concertData}`, function (err) {
                            if (err) throw err;
                        })
                    }
                });
            })
            break;

        case "insult-me":
            axios.get("https://insult.mattbas.org/api/insult.json").then(function (response) {
                console.log(response.data.insult)
                fs.appendFile("log.txt", "insult-me\n" + response.data.insult + divider, function (err) {
                    if (err) throw err;
                })
            })
            break;

        case "quote-me":

            axios.get("http://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1").then(function (response) {
                var quoteData = `"${response.data[0].content.slice(3, response.data[0].content.length - 6)}" -${response.data[0].title}`
                console.log(quoteData)
                fs.appendFile("log.txt", "quote-me\n" + quoteData + divider, function (err) {
                    if (err) throw err;
                })
            })
            break;

        case "spotify-this-song":
            if (!userInput) {
                userInput = "the Sign"
                spotify
                    .search({
                        type: 'track',
                        query: userInput
                    })
                    .then(function (response) {
                        var spotifyData = `Band/Artist Name: ${response.tracks.items[9].artists[0].name}\nSong Name: ${response.tracks.items[9].name}\nAlbum Name: ${response.tracks.items[9].album.name}\nPreview URL: ${response.tracks.items[9].preview_url}`
                        console.log(spotifyData)
                        fs.appendFile("log.txt", "spotify-this-song\n" + userInput + spotifyData + divider, function (err) {
                            if (err) throw err;
                        })
                    }).catch(function (err) {
                        console.log(err);
                    });

            } else {
                spotify.search({
                        type: 'track',
                        query: userInput
                    })
                    .then(function (response) {
                        var spotifyData = `Band/Artist Name: ${response.tracks.items[0].artists[0].name}\nSong Name: ${response.tracks.items[0].name}\nAlbum Name: ${response.tracks.items[0].album.name}\nPreview URL: ${response.tracks.items[0].preview_url}`
                        console.log(spotifyData)
                        fs.appendFile("log.txt", "spotify-this-song\n" + userInput + spotifyData + divider, function (err) {
                            if (err) throw err;
                        })
                    }).catch(function (err) {
                        console.log(err);
                    });
            }
            break;

        case "movie-this":
            if (!userInput) {
                userInput = "Mr. Nobody"
            }
            var movieQueryUrl = "http://www.omdbapi.com/?t=" + userInput + "&y=&plot=short&apikey=trilogy";
            axios.get(movieQueryUrl).then(
                function (response) {

                    var movieData = `Title: ${response.data.Title}\nRelease Year: ${response.data.Year}\nIMDB Rating: ${response.data.Ratings[0].Value}\nRotten Tomatoes Rating: ${response.data.Ratings[1].Value}\nCountry: ${response.data.Country}\nLanguage: ${response.data.Language}\nPlot: ${response.data.Plot}\nCast: ${response.data.Actors}`
                    console.log(movieData)
                    fs.appendFile("log.txt", "movie-this\n" + userInput + movieData + divider, function (err) {
                        if (err) throw err;
                    })

                }
            );
            break;

        case "random-fact":
            axios.get("https://opentdb.com/api.php?amount=1").then(function (response) {
                var fact = `${response.data.results[0].question} \n${response.data.results[0].correct_answer}`
                console.log(fact)

                fs.appendFile("log.txt", "random-fact\n" + fact + divider, function (err) {
                    if (err) throw err;
                })
            });
            break;

        case "do-what-it-says":
            fs.readFile("random.txt", "utf8", function (error, data) {

                if (error) {
                    return console.log(error);
                }
                var dataArr = data.split("; ");
                var rando = Math.floor(Math.random() * dataArr.length)
                var cmdArr = dataArr[rando].split(",");
                parg = cmdArr[0];
                userInput = cmdArr[1];
                fs.appendFile("log.txt", "do-what-it-says\n" + divider, function (err) {
                    if (err) throw err;
                })
                setTimeout(liriCmds, 30)
            })
            break;

        default:
            return console.log("I don't understand, please enter a valid command.");
    }
}

liriCmds()