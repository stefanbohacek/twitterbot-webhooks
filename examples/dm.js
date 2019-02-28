const twitterbot = require('./twitterbot');

twitterbot.on('direct_message_events', function(dm){
  var text;

  /*
    dm.message_data.text contains the text from the DM.
  */  
  
  if (dm.message_data.text.toLowerCase().match(/(hello|hi)/g)){
    text = 'hello 👋';
  }
  else{
    text = '¯\_(ツ)_/¯';
  }

  twitterbot.twit.post('direct_messages/events/new', {
    'event': {
      'type': 'message_create',
      'message_create': {
        'target': {
          'recipient_id': dm.sender_id
        },
        'message_data': {
          'text': 'Hello!'
        }
      }
    }
  }, function(err, data, response) {
    if (err){
      console.log('ERROR:\n', err);
    }
  });  
});

/*
  You can also use the send_dm helper function, like this:
*/

twitterbot.on('direct_message_events', function(dm){
    twitterbot.send_dm(dm.sender_id, 'Hello!', function(err){
      if (err){
        console.log(err);
      }
    });
});