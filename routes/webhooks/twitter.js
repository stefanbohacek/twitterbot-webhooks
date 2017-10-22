var path = require('path'),
    express = require('express'),
    router = express.Router(),
    bodyParser = require('body-parser'),
    exphbs  = require('express-handlebars'),
    crypto = require('crypto'),
    util = require('util'),
    app = express(),   
    twitter = require(__dirname + '/../../twitter.js'),
    twitterbot = require(__dirname + '/../../twitterbot.js');

router.get('/', function(req, res) {
/* Handle crc_token. */
  console.log('GET /webhooks/twitter');
  var res = res,
      crc_token = req.param('crc_token');

  if (crc_token){
    console.log('crc_token', crc_token);
    var response_token = `sha256=${crypto.createHmac('sha256', process.env.CONSUMER_SECRET).update(crc_token).digest('base64')}`;

    console.log('response_token', response_token);
    res.send(JSON.stringify({
      'response_token': response_token
    }));
  }
  else{
    console.log('no crc_token, registering webhook url');
    twitter.register_webhook(res);
  }
});

router.post('/', function(req, res) {
  /* Handle webhook requests. */
  // console.log('new webhook request\n', util.inspect(req.body, false, null));
  console.log('new webhook request...');
  if (req.body.direct_message_events){
    var message = req.body.direct_message_events[0],
        users = req.body.users;
    
    if (message.type === 'message_create'){
      twitterbot.handle_twitter_dm(message, users);
    }    
  }
});

module.exports = router;
