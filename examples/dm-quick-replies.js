/*
  https://developer.twitter.com/en/docs/direct-messages/quick-replies/api-reference/options
*/
const twitterbot = require('./twitterbot');

twitterbot.on('direct_message_events', function(dm){
  if (dm.message_data.quick_reply_response){
    twitterbot.send_dm(dm.sender_id, `Okay, I'll get your ${dm.message_data.text.toLowerCase()} 😊`, function(err){
      if (err){
        console.log(err);
      }
    });
  } else {
    twitterbot.twit.post('direct_messages/events/new', {
      'event': {
        'type': 'message_create',
        'message_create': {
          'target': {
            'recipient_id': dm.sender_id
          },
          'message_data': {
            'text': 'What can I get you?',
            'quick_reply': {
              'type': 'options',
              'options': [
                {
                  'label': 'Tea',
                  'description': 'Nice and hot.',
                  'metadata': 'drink_preference_tea'
                },
                {
                  'label': 'Coffee',
                  'description': 'Black, no sugar.',
                  'metadata': 'drink_preference_coffee'
                },
                {
                  'label': 'Water',
                  'description': 'Tap is fine.',
                  'metadata': 'drink_preference_water'
                }
              ]
            }
          }
        }
      }
    }, function(err, data, response) {
      if (err){
        console.log('ERROR:\n', err);
      }
    });
  }
});