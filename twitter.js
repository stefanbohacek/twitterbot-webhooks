var Twit = require('twit'),
    config = {
      twitter: {
        consumer_key: process.env.CONSUMER_KEY,
        consumer_secret: process.env.CONSUMER_SECRET,
        access_token: process.env.ACCESS_TOKEN,
        access_token_secret: process.env.ACCESS_TOKEN_SECRET
      }
    },
    T = new Twit(config.twitter),
    stream = T.stream('statuses/sample');

module.exports = {
  send_dm: function(sender_id, message_text, cb){
    T.post('direct_messages/new', {
      user_id: sender_id,
      text: message_text
    }, function(err, data, response) {
      if(cb){
        cb(err);
      }      
    });  
  },
  register_webhook: function(res){
    T.post('account_activity/webhooks', { url: `https://${process.env.PROJECT_NAME}.glitch.me/webhooks/twitter` }, function(err, data, response) {
      if (err){
        console.log('GET webhooks ERROR (1)\n', {err});
        switch(err.message){
          case 'Too many resources already created.':
            T.get('account_activity/webhooks', {}, function(err, data, response) {
              if (err){
                console.log('GET webhooks ERROR (2)\n', {err});
                // res.sendStatus(500);
              }
              else{
                if (data.valid){
                  console.log('webhook url already registered\n', {data});
                  res.sendStatus(200);                
                }
                else{
                  console.log(data);
                  console.log('deleting invalid webhook url...');

                  T.delete(`account_activity/webhooks/${data[0]['id']}`, {}, function(err, data, response) {
                    if (err){
                      console.log('DELETE webhooks ERROR\n', {err});
                      res.sendStatus(500);
                    }
                    else{
                      console.log('webhook url deleted');
                      /* First, de-register current URL, then redirect to register again. */
                      res.redirect('/webhooks/twitter');
                    }
                  });
                }
              }
            });
            break;
          default:
            console.log(err);
            res.sendStatus(500);
          break;
        }
      }
      else{
        console.log('webhook url registered, subscribing...\n', {data});
        
        T.post(`account_activity/webhooks/${data.id}/subscriptions`, { webhook_id : data.id }, function(err, data, response) {
          if (err){
            console.log('GET webhooks ERROR (3)\n', {err});
            console.log(err.allErrors);
            console.log(err.twitterReply);
            res.sendStatus(500);
          }
          else{
            console.log('webhook url registered');
            console.log(data);
            res.render('home', {'project-name': process.env.PROJECT_NAME, 'message': 'webhook url registered' });
          }
        });
      }
    });
  }
}
