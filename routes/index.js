var express = require('express');
var router = express.Router();
var Twitter = require('twitter');

// Require & run the code in env.js so they can be accessed via process.env.*
require('../env.js');

// Set up Twitter Client
var twitterClient = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
});


/* GET home page. */
router.get('/', function(req, res, next) {
    var tweets = '';
    var params = {
        q: '#dtla',
        geocode: '34.052234,-118.243685,2mi',
        include_entities: 'true'
    };
    
    twitterClient.get('search/tweets', params, function(error, tweets, response){
        if (!error) {
            res.render('index', { title: 'Twitter Map', tweets: listTweets(tweets) });
        } else {
            res.render('index', { title: 'Twitter Map', tweets: error });
        }
    });
  
});

var listTweets = function (tweets) {
    var messages = '';
    
    if (tweets.statuses.length > 0) {
        tweets.statuses.forEach(function (tweet) {
            messages += '<div class="tweet">';
            if (tweet.geo != null) {
                messages += 'Coordinates: ' + tweet.geo.coordinates + '<br />';
            }
            
            if (tweet.entities.media != undefined) {
                messages += '<img src="' + tweet.entities.media[0].media_url_https + ':small" /><br />';
            }
            messages += tweet.text + '</div>';
        });
    }
    
    return messages;
}


module.exports = router;
