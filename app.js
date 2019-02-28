if ( !process.env.TWITTER_CONSUMER_KEY || !process.env.TWITTER_CONSUMER_SECRET || !process.env.TWITTER_ACCESS_TOKEN || !process.env.TWITTER_ACCESS_TOKEN_SECRET ){
  console.log('Please update your .env file with Twitter API keys.');
  process.exit();
}

const twitterbot = require('./twitterbot');

/*
  See code samples inside the examples folder. Happy tweeting!
*/

twitterbot.on('direct_message_events', function(dm){
    twitterbot.send_dm(dm.sender_id, 'Hello!', function(err){
      if (err){
        console.log(err);
      }
    });
});

const dashboard = require('./dashboard')(twitterbot);