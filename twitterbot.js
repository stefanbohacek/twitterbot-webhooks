var config = {
      username: process.env.BOT_USERNAME,
   /* Be sure to update the .env file with your API keys.
      See how to get them: https://botwiki.org/tutorials/how-to-create-a-twitter-app */
      consumer_key: process.env.TWITTER_CONSUMER_KEY,
      consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
      access_token: process.env.TWITTER_ACCESS_TOKEN,
      access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
    },
    Twit = require('twit'),
    T = new Twit(config),
    helpers = require(__dirname + '/helpers.js'),
    util = require('util');

module.exports = {
  twit: T,
  tweet: function(text, cb){
    T.post('statuses/update', { status: text }, function(err, data, response) {
      if (cb){
        cb(err, data, response);
      }
    });    
  },
  retweet: function(tweet_id, cb){
    T.post('statuses/retweet/:id', { id: tweet_id }, function (err, data, response) {
      if (cb){
        cb(err, data, response);
      }
    })
  },
  reply: function(tweet_id, status, cb){
    T.post('statuses/update',{
      in_reply_to_status_id: tweet_id,
      auto_populate_reply_metadata: true,
      status: status
    }, function(err, data, response) {
      if (cb){
        cb(err);
      }
    });
  },  
  send_dm: function(user_id, text, cb){
    console.log('sending DM...');
    T.post('direct_messages/indicate_typing', {
      'recipient_id': user_id
    }, function(err, data, response) {
      if (err){
        console.log('ERROR:\n', err);
      }
      T.post('direct_messages/events/new', {
        'event': {
          'type': 'message_create',
          'message_create': {
            'target': {
              'recipient_id': user_id
            },
            'message_data': {
              'text': text,
            }
          }
        }
      }, function(err, data, response) {
        if (err){
          console.log('ERROR:\n', err);
        }
        if (cb){
          cb(err, data, response);
        }
      });
    
    });
  },
  post_image: function(text, image_base64, cb) {
   T.post('media/upload', { media_data: image_base64 }, function (err, data, response) {
      if (err){
        console.log('ERROR:\n', err);
      }
      if (cb){
        cb(err);
      }
     
      else{
        console.log('tweeting the image...');
        T.post('statuses/update', {
          status: text,
          media_ids: new Array(data.media_id_string)
        },
        function(err, data, response) {
          if (err){
            console.log('ERROR:\n', err);
            if (cb){
              cb(err);
            }
          }
          else{
            console.log('tweeted');
            if (cb){
              cb(null);
            }
          }
        });
      }
    });
  },  
  update_profile_image: function(image_base64, cb) {
    console.log('updating profile image...');
    T.post('account/update_profile_image', {
      image: image_base64
    },
    function(err, data, response) {
      if (err){
        console.log('ERROR:\n', err);
        if (cb){
          cb(err);
        }
      }
      else{
        if (cb){
          cb(null);
        }
      }
    });
  },
  delete_last_tweet: function(cb){
    console.log('deleting last tweet...');
    T.get('statuses/user_timeline', { screen_name: process.env.BOT_USERNAME }, function(err, data, response) {
      if (err){
        if (cb){
          cb(err, data);
        }
        return false;
      }
      if (data && data.length > 0){
        var last_tweet_id = data[0].id_str;
        T.post(`statuses/destroy/${last_tweet_id}`, { id: last_tweet_id }, function(err, data, response) {
          if (cb){
            cb(err, data);
          }
        });
      } else {
        if (cb){
          cb(err, data);
        }
      }
    });
  },
  bot_behavior: [],
  on: function(event, event_handler){
    if (this.bot_behavior[event]){
        this.bot_behavior[event].push(event_handler);
    }
    else{
        this.bot_behavior[event] = [event_handler];
    }
  },
  handle_event: function(event){
    var bot_behavior = this.bot_behavior;
    // console.log(util.inspect(event, false, null));
    
    if (event.direct_message_indicate_typing_events){
      event.direct_message_indicate_typing_events.forEach(function(typing_event){
        var user_typing = event.users[typing_event.sender_id].screen_name;
          if (user_typing !== process.env.BOT_USERNAME){
            console.log(`@${user_typing} is typing...`);
            if (bot_behavior['direct_message_indicate_typing_events']){
              bot_behavior['direct_message_indicate_typing_events'].forEach(function(fn){
                fn(event);
              });
            }
          }
      });
    }    
    if (event.direct_message_events){
      event.direct_message_events.forEach(function(dm_event){
        var dm_sender = event.users[dm_event.message_create.sender_id].screen_name;
        if (dm_sender !== process.env.BOT_USERNAME){
          console.log(`received new DM from @${dm_sender}...`);
          
          if (bot_behavior['direct_message_events']){
            bot_behavior['direct_message_events'].forEach(function(fn){
              fn(dm_event.message_create);
            });
          }
        }
      });
    }

    if (event.follow_events){
      event.follow_events.forEach(function(follow_event){
        var new_follower = follow_event.source.screen_name;
        if (new_follower !== process.env.BOT_USERNAME){
          console.log(`@${new_follower} started following...`);
          
          if (bot_behavior['follow_events']){
            bot_behavior['follow_events'].forEach(function(fn){
              fn(follow_event.source);
            });
          }
        }
      });
    }    
  
    if (event.tweet_create_events){
      event.tweet_create_events.forEach(function(tweet_create_event){
        
        var tweet_from_screen_name = tweet_create_event.user.screen_name;
        if (tweet_from_screen_name !== process.env.BOT_USERNAME){
          console.log(`new tweet from @${tweet_from_screen_name}...`);
          
          if (bot_behavior['tweet_create_events']){
            bot_behavior['tweet_create_events'].forEach(function(fn){
              fn(tweet_create_event);
            });
          }
        }
      });
    }
    
    if (event.favorite_events){
      event.favorite_events.forEach(function(favorite_event){
        // console.log(util.inspect(favorite_event, false, null));
        var favorite_event_user_screen_name = favorite_event.user.screen_name;
        
        if (favorite_event_user_screen_name !== process.env.BOT_USERNAME){
          console.log(`@${favorite_event_user_screen_name} favorited a tweet...`);
          
          if (bot_behavior['favorite_events']){
            bot_behavior['favorite_events'].forEach(function(fn){
              fn(favorite_event.favorited_status, favorite_event.user);
            });
          }
        }
      });
    }


    if (event.block_events){
      event.block_events.forEach(function(block_event){
        // console.log(util.inspect(block_event, false, null));
        var block_event_user_screen_name = block_event.user.screen_name;
        
        if (block_event_user_screen_name !== process.env.BOT_USERNAME){
          console.log(`@${block_event_user_screen_name} favorited a tweet...`);
          
          if (bot_behavior['block_events']){
            bot_behavior['block_events'].forEach(function(fn){
              fn(block_event.user);
            });
          }
        }
      });
    }

    if (event.direct_message_mark_read_events){
      // console.log(util.inspect(event, false, null));
      
      event.direct_message_mark_read_events.forEach(function(direct_message_mark_read_event){
        var direct_message_mark_read_event_user_screen_name = event.users[direct_message_mark_read_event.sender_id].screen_name;

        if (direct_message_mark_read_event_user_screen_name !== process.env.BOT_USERNAME){          
          if (bot_behavior['direct_message_mark_read_events']){
            bot_behavior['direct_message_mark_read_events'].forEach(function(fn){
              fn(direct_message_mark_read_event.favorited_status, direct_message_mark_read_event.user);
            });
          }
        }
      });
    }
    

  }
};
