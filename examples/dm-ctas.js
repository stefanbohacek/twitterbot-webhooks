/*
  https://developer.twitter.com/en/docs/direct-messages/buttons/api-reference/buttons#ctas-object
*/

const twitterbot = require('./twitterbot');

twitterbot.on('direct_message_events', function(dm){
  twitterbot.twit.post('direct_messages/events/new', {
      'event': {
        'type': 'message_create',
        'message_create': {
          'target': {
            'recipient_id': dm.sender_id
          },
          'message_data': {
            'text': 'hello',
            'ctas': [
              {
                'type': 'web_url',
                'label': 'Visit Botwiki',
                'url': 'https://botwiki.org'
              },
              {
                'type': 'web_url',
                'label': 'Submit your bot',
                'url': 'https://botwiki.org/submit-your-bot'
              },
              {
                'type': 'web_url',
                'label': 'Join Botmakers',
                'url': 'https://botmakers.org'
              }
            ] 
          }
        }
      }
    }, function(err, data, response) {
      if (err){
        console.log('ERROR:\n', err);
      }
    });
});