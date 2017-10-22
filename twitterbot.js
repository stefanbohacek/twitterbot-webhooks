var twitter = require(__dirname + '/twitter.js');

module.exports = {
  handle_twitter_dm(message, users){
    /*
    You can update this function to handle DMs received by your bot.
    sender_id is the ID of the person who sent the message, message_text is the text of the DM that was sent.
    */

    var message_id = message.id,
        sender_id = message.message_create.sender_id,
        sender_screen_name = users[sender_id].screen_name,
        sender_name = users[sender_id].name,
        message_text = message.message_create.message_data.text,
        message_entities = message.message_create.message_data.entities;
        // message_entities = { hashtags: [], symbols: [], user_mentions: [], urls: [] } 

    if (sender_screen_name !== process.env.SCREEN_NAME){
      console.log(`new direct message from ${sender_name} (@${sender_screen_name}):\n> ${message_text}`);

      twitter.send_dm(sender_id, 'Hello 👋', function(err){
        if (err){
          console.log('err', {err});
        }
        else{
          console.log(`sent message to @${sender_screen_name}`)
        }
      });
    }
  }
}
