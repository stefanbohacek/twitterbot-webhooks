Glitch Twitter bot template with Twitter Webhooks API
=====================================================


![Emoji wave hand](https://cdn.glitch.com/10c150f9-8a5f-4e26-8697-92c6eccd98fe%2Fdm.png?1497584587928)

This is a template for making fun Twitter bots with [Glitch](https://glitch.com/) and the [Twit](https://github.com/ttezel/twit) node.js library. It uses the new [Twitter Webhooks API](https://dev.twitter.com/webhooks).

While this API is in beta, you need to [get your Twitter application whitelisted](https://dev.twitter.com/webhooks/account-activity) and the API only supports delivery of Direct Messages.



## A quick tutorial


1. First, create a new Twitter account and a new Twitter app. ([This tutorial](https://botwiki.org/tutorials/how-to-create-a-twitter-app/) shows how.)
2. Update the `.env` file with your Twitter API key/secrets. (The tutorial above explains how to get these.)
3. Update `server.js` with some cool Twitter bot code. (The included example simply responds to every DM with "Hello 👋".)
4. Open your project's page (it looks like https://PROJECT-NAME.glitch.me) and click **Register webhook**.
5. Your bot can now respond to DMs!

Also, for your convenience, your project's log will show your bot's activity.

![Logging](https://cdn.glitch.com/10c150f9-8a5f-4e26-8697-92c6eccd98fe%2Fconsole.PNG?1497585764013)


Check out [the Twit module documentation](https://github.com/ttezel/twit) for more examples of what your bot can do.

You can find more [tutorials](https://botwiki.org/tutorials/twitterbots/#tutorials-nodejs) and [open source Twitter bots](https://botwiki.org/tag/twitter+bot+opensource+nodejs/) on [Botwiki](https://botwiki.org).

And be sure to join the [Botmakers](https://botmakers.org/) online hangout and [submit your bot to Botwiki](https://botwiki.org/submit-your-bot) :-)


##  TODO

- break things up into modules as new functionality is added to the Webhooks API
- message queue to handle API rate limits


**Powered by [Glitch](https://glitch.com)**

\ ゜o゜)ノ
