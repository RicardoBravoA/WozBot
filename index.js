var Botkit = require('botkit');

var controller = Botkit.slackbot({
  debug: false
  //include "log: false" to disable logging
  //or a "logLevel" integer from 0 to 7 to adjust logging verbosity
});

//xoxb-135761155234-yKQdQPgRU3zW6kQJporR4dZf
// connect the bot to a stream of messages
controller.spawn({
  token: "xoxb-135761155234-yKQdQPgRU3zW6kQJporR4dZf",
}).startRTM()

/*
// give the bot something to listen for.
controller.hears(['hello', 'hi', 'hola'],['direct_message','direct_mention','mention'],function(bot,message) {
  bot.reply(message,'Hola');
});
*/

controller.hears('tengo (.*)',['direct_message','direct_mention','mention'],function(bot,message) {
  var state = message.match[1]; //match[1] is the (.*) group. match[0] is the entire group (open the (.*) doors).
  if (state === 'hambre') {
    return bot.reply(message, 'Come');
  } else if (state === 'sueño'){
  	return bot.reply(message, 'Duerme')
  }
  return bot.reply(message, 'No te entiendo');
});

controller.hears(['hello', 'hi', 'hola'],['direct_message','direct_mention','mention'],function(bot,message) {

	var action;
	var inmueble;

	bot.reply(message, 'Hola');
	bot.startConversation(message, function(error, conversation){
		conversation.ask('¿Desea `comprar` o `alquilar` un inmueble?', [
		  	{
		  		pattern: 'comprar',
		  		callback: function(response, conversation){
		  			conversation.next();
		  		}
		  	},
		  	{
		  		pattern: 'alquilar',
		  		callback: function(response, conversation){
		  			conversation.next();
		  		}
		  	},
		  	{
		  		default: true,
		  		callback: function(response, conversation){
		  			conversation.repeat();
		  			conversation.next();
		  		}
		  	}
	  	], {'key': 'action'});

	  	conversation.on('end', function(conversation){

	  		if(conversation.status == 'completed'){
	  			action = conversation.extractResponse('action');

	  			bot.reply(message, 'Action '+action);
	  			typeConversation(message, conversation);

	  		}else{
	  			bot.reply(message, 'OK, bye!');
  			}
  		});

	});

	typeConversation = function(response, conversation){
		bot.startConversation(message, function(error, conversation){
			conversation.ask('Buscas '+action+' un `departamento` o `casa`', [
			  	{
			  		pattern: 'departamento',
			  		callback: function(response, conversation){
			  			conversation.next();
			  		}
			  	},
			  	{
			  		pattern: 'casa',
			  		callback: function(response, conversation){
			  			conversation.next();
			  		}
			  	},
			  	{
			  		default: true,
			  		callback: function(response, conversation){
			  			conversation.repeat();
			  			conversation.next();
			  		}
			  	}
		  	], {'key': 'inmueble'});

		  	conversation.on('end', function(conversation){

		  		if(conversation.status == 'completed'){
		  			inmueble = conversation.extractResponse('inmueble');

		  			confirmationConversation(message, conversation);

		  		}else{
		  			bot.reply(message, 'OK, bye!');
	  			}
	  		});

		});
	}

	confirmationConversation = function(response, conversation){

		var conector = 'un';

		if(inmueble == 'casa'){
		  	conector = 'una';
		}

		bot.startConversation(message, function(error, conversation){
			conversation.ask("¿Desea `"+action+"` "+conector+" `"+inmueble+"`?", [
			  	{
			  		pattern: 'si',
			  		callback: function(response, conversation){
			  			conversation.next();
			  		}
			  	},
			  	{
			  		pattern: 'no',
			  		callback: function(response, conversation){
			  			bot.reply(message, 'OK, bye!');
			  			conversation.next();
			  		}
			  	},
			  	{
			  		default: true,
			  		callback: function(response, conversation){
			  			bot.reply(message, 'OK, bye!');
			  		}
			  	}
		  	], {'key': 'sino'});

		  	conversation.on('end', function(conversation){

		  		if(conversation.status == 'completed'){
		  			bot.reply(message, 'Estamos buscando su mejor lugar para vivir...');

		  		}else{
		  			bot.reply(message, 'OK, bye!');
	  			}
	  		});

		});
	}

	

});

controller.hears(['abc', 'cba'],['direct_message','direct_mention','mention'],function(bot,message) {

  bot.startConversation(message, function(error, conversation){
  	conversation.ask('Hola', function(response, conversation) {
	  	conversation.ask('¿Desea `comprar` o `alquilar` un inmueble?', [
		  	{
		  		pattern: 'comprar',
		  		callback: function(response, conversation){
		  			conversation.next();
		  		}
		  	},
		  	{
		  		pattern: 'alquilar',
		  		callback: function(response, conversation){
		  			conversation.next();
		  		}
		  	},
		  	{
		  		default: true,
		  		callback: function(response, conversation){
		  			conversation.repeat();
		  			conversation.next();
		  		}
		  	}
	  	]);

	  	conversation.next();

	  }, {'key': 'action'});

  		conversation.on('end', function(conversation){
  			if(conversation.status == 'completed'){
  				const action = conversation.extractResponse('action');

  				bot.reply(message, 'Buscas '+action+' un inmueble');

  			}else{
  				bot.reply(message, 'OK, bye!');
  			}
  		});



	});

});


controller.hears(['what is my name', 'who am i'], 'direct_message,direct_mention,mention', function(bot, message) {

    controller.storage.users.get(message.user, function(err, user) {
        if (user && user.name) {
            bot.reply(message, 'Your name is ' + user.name);
        } else {
            bot.startConversation(message, function(err, convo) {
                if (!err) {
                    convo.say('I do not know your name yet!');
                    convo.ask('What should I call you?', function(response, convo) {
                        convo.ask('You want me to call you `' + response.text + '`?', [
                            {
                                pattern: 'yes',
                                callback: function(response, convo) {
                                    // since no further messages are queued after this,
                                    // the conversation will end naturally with status == 'completed'
                                    convo.next();
                                }
                            },
                            {
                                pattern: 'no',
                                callback: function(response, convo) {
                                    // stop the conversation. this will cause it to end with status == 'stopped'
                                    convo.stop();
                                }
                            },
                            {
                                default: true,
                                callback: function(response, convo) {
                                    convo.repeat();
                                    convo.next();
                                }
                            }
                        ]);

                        convo.next();

                    }, {'key': 'nickname'}); // store the results in a field called nickname

                    convo.on('end', function(convo) {
                        if (convo.status == 'completed') {
                            bot.reply(message, 'OK! I will update my dossier...');

                            controller.storage.users.get(message.user, function(err, user) {
                                if (!user) {
                                    user = {
                                        id: message.user,
                                    };
                                }
                                user.name = convo.extractResponse('nickname');
                                controller.storage.users.save(user, function(err, id) {
                                    bot.reply(message, 'Got it. I will call you ' + user.name + ' from now on.');
                                });
                            });



                        } else {
                            // this happens if the conversation ended prematurely for some reason
                            bot.reply(message, 'OK, nevermind!');
                        }
                    });
                }
            });
        }
    });
});
