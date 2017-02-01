var Botkit = require('botkit');

var controller = Botkit.slackbot({
  debug: false
  //include "log: false" to disable logging
  //or a "logLevel" integer from 0 to 7 to adjust logging verbosity
});

// connect the bot to a stream of messages
controller.spawn({
  token: "xoxb-135761155234-yKQdQPgRU3zW6kQJporR4dZf",
}).startRTM()

// give the bot something to listen for.
controller.hears(['hello', 'hi', 'hola'],['direct_message','direct_mention','mention'],function(bot,message) {

  bot.reply(message,'Hola');

});
