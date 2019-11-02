//var players;
var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});

//var length;
class DBUserDatabase
{
     //players;

    constructor()
    {
        this.players = new Array();
        this.length = this.players.length;
    }
	updateFile()
	{
		const fs = require('fs');
        for (var i = 0; i < this.players.length; i++) 
        {
			fs.writeFile('user_data.txt', this.players[i].getName() + ' --> Level: ' + this.players[i].getLevel() + '\n', (err) => {
			// throws an error, you could also catch it here
			if (err) throw err;
			});
            
        }
    }
    addPlayer(DBUsername)
    {
        this.players[this.players.length] = new DBUser(DBUsername, 1);;
		this.updateFile();
    }
    levelUp(userID)
    {
        for (var i = 0; i < this.players.length; i++) 
        {
            if (this.players[i].getName() == userID)
            {
                this.players[i].incrementLevel();
                break;
            }
            bot.sendMessage({
                to: channelID,
                message: userID + ' has leveled up!'
            });
        }
		this.updateFile();
    }
    printAll(channelID)
    {
        for (var i = 0; i < this.players.length; i++) 
        {
            bot.sendMessage({
                to: channelID,
                message: this.players[i].getName() + ' --> Level: ' + this.players[i].getLevel()
            });
        }
    }
}

class DBUser 
{
    constructor(name, level) 
    {
        this.name = name;
        this.level = level;
    }
    getName()
    {
        return this.name;    
    }
    getLevel()
    {
        return this.level;
    }
    incrementLevel()
    {
        this.level++;
    }
}

var playerDatabase = new DBUserDatabase();


bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});

bot.on('message', function (user, userID, channelID, message, evt) {

    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
        var cmd2 = args[1];

        args = args.splice(1);
        switch(cmd) {
            // !help
            case 'help':
            {
                bot.sendMessage({
                    to: channelID,
                    message: 'List of commands:\n!help: list of commands \n!start: starts a round of the rpg'
                });
            }
            break;
            case 'configure':
            {
                bot.sendMessage({
                    to: channelID,
                    message: 'Hello, ' + user
                });
                playerDatabase.addPlayer(userID);
            }    
            break;
            case 'levelup':
            {
                playerDatabase.levelUp(userID);
            }
            break;
            case 'everyone':
            {
                playerDatabase.printAll(channelID);
            }
            break;
			//tutorial
			case 'tutorial':
				switch(cmd2){
					//Tutorial 1
					case '1':
						bot.sendMessage({
							to: channelID,
							message: 'Print Statements: ```python\nprint(\'Your Message\')\n```\n or: ```python\nprint(\'Your\', \'Messahe\')\n```\n Variable Assignment: ```python\nvar_name = value\n```'
						});
					break;
					//Tutorial 2
					case '2':
						bot.sendMessage({
							to: channelID,
							message: 'If/Else Statements: ```python\nif case1:\n\t#whatever you want to happen\nelif case2:\n\t#whatever you want to happen if case1 is false, but case2 is true\nelse:\n\t#whatever you want to happen if case1 and case2 are both false/n```'
						});
					break;
					//Tutorial 3
					case '3':
						bot.sendMessage({
							to: channelID,
							message: 'While Loops: ```python\nwhile case1:\n\t#whatever you want to happen until case1 is false\n```\nFor Loops: ```python\nfor i in range(n):\n\t#whatever you want to run 5 times\n```'
						});
					break;
					//Tutorial 4
					case '4':
						bot.sendMessage({
							to: channelID,
							message: 'Functions: ```python\ndef func_name(args):\n\t#whatever the function does\n```'
						});
					break;
					//If no number entered, or number is out of range
					default:
						bot.sendMessage({
							to: channelID,
							message: 'Add a number after tutorial \nTutorial 1 is print statements and variable assignment\nTutorial 2 is if/else statements \nTutorial 3 is loops \nTutorial 4 is functions'
						});
					break;
				}
            break;
            // Just add any case commands if you want to..
         }
     }
});