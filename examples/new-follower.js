const twitterbot = require('./twitterbot');

twitterbot.on('follow_events', function(follower){
  // console.log({follower});
  /*
    See what a 'follower' user object looks like:
    https://developer.twitter.com/en/docs/tweets/data-dictionary/overview/user-object.html
  */

  twitterbot.twit.post('statuses/update', {
    status: `@${follower.screen_name} Thanks for the follow!`,
  }, function(err, data, response) {
    if (err){
      console.log('Error', err);
    }
  });

/*
  Or with a helper function.

  twitterbot.tweet(`@${follower.screen_name} Thanks for the follow!`, function(err, data, response){
    if (err){
      console.log('Error', err);
    }
  });  

*/

});

const dashboard = require('./dashboard')(twitterbot);