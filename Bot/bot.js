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
    addPlayer(DBUsername)
    {
        this.players[this.players.length] = new DBUser(DBUsername, 1);;
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
        args = args.splice(1);
        switch(cmd) {
            // !ping
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
            // Just add any case commands if you want to..
         }
     }
});