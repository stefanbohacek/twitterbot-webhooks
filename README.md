![Hello, bot!](https://cdn.glitch.com/83eb7282-8b27-4a01-9b8c-1c12487c6c08%2Fhello-bot.png?1526659763652)

# Twitter Bot Starter Project with Webhooks and Account Activity API

This starter projects is based on [account-activity-dashboard](https://github.com/twitterdev/account-activity-dashboard) and uses Twitter's [Account Activity API](https://developer.twitter.com/en/docs/accounts-and-users/subscribe-account-activity/overview).


## Tutorial

### Set up your app


1. Remix this app.

2. [Create a Twitter app](https://botwiki.org/tutorials/how-to-create-a-twitter-app/)

3. On the **Permissions** tab > **Access** section > enable **Read, Write and Access direct messages**.

4. On the **Keys and Access Tokens** tab > **Your Access Token** section > click **Create my access token** button.

5. From the **Keys and Access Tokens** tab, copy the `consumer key`, `consumer secret`, `access token` and `access token secret` and add them to your `.env` file. You can also set `BOT_USERNAME`to your bot's screen name (without the @).

6. On the **Settings** page, add the following URL values as whitelisted Callback URLs:

    ```text
    https://PROJECTNAME.glitch.me/callbacks/addsub
    https://PROJECTNAME.glitch.me/callbacks/removesub
    ```

7. [Apply for a developer account](https://developer.twitter.com/en/apply/user), if you don't have one yet.

8. Once you have your developer account, go to your developer dashboard and [create a new environment](https://developer.twitter.com/en/account/environments) for **Account Activity APISandbox**. Save the environment name as `ENV_NAME` in your `.env` file.


9. To configure your webhook, load this web app in your browser (use the **Show** button) and follow the instructions below:

<!-->

  1. **Setup webhook config.** Navigate to the "manage webhook" view. Enter your webhook URL as `https://PROJECTNAME.glitch.me/webhook/twitter` and click "Create/Update."

  2. **Add a user subscription.** Navigate to the "manage subscriptions" view. Click "add" and proceed with Twitter sign-in. Once complete your webhook will start to receive account activity events for the user.


### Write your bot code

All your bot code will be inside `app.js`. You can access the [twit](https://github.com/ttezel/twit) library as `twitterbot.twit`, and there is a few helper methods  in `twitterbot.js`, like `tweet` or `send_dm`. 


```
const twitterbot = require('./twitterbot');

twitterbot.on('direct_message_events', function(dm){
    twitterbot.send_dm(dm.sender_id, 'hello', function(err){
      if (err){
        console.log(err);
      }
    });
});

const dashboard = require('./dashboard')(twitterbot);
```

Be sure to check out the `examples` folder, and join us over at botmakers.org!

## TODO:

- make Account Activity log persistent (1 week?)
- store API calls in a queue and work around the API rate limits
- save the ID of the events the bot already responded to
