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
<<<<<<< HEAD
    sortPlayers()
    {  
        this.players.sort(function(DBUser1, DBUser2) { return DBUser2.getLevel() - DBUser1.getLevel(); });
    }
    printLeaderboard(channelID)
    {
        this.sortPlayers();
        var str = '';
        for (var i = 0; i < this.players.length; i++) 
        {
           
                str += "\n"+ (i+1) + ': ' + this.players[i].getName() + ' --> Level: ' + this.players[i].getLevel()
            
        }
          bot.sendMessage({
            to: channelID,
            message: str
            });
    }
    addPlayer(DBUsername)
    {
        this.players[this.players.length] = new DBUser(DBUsername, 1, false);
=======
	readFromFile(){
		var fs = require('fs');
		var lines = fs.readFileSync('user_data.txt').toString().split("\n");
		for (var i = 0; i < lines.length; i++){
			var splitted = lines[i].split(" --> Level: ");
			if (spitted[0] != ''){
				this.players[this.players.length] = new DBUser(splitted[0],splitted[1]);
			}
		}
	}
	updateFile()
	{
		const fs = require('fs');
		fs.open('user_data.txt', 'w', function (err, file) {
			if (err) throw err;
			});
        for (var i = 0; i < this.players.length; i++) 
        {
			fs.appendFile('user_data.txt', this.players[i].getName() + ' --> Level: ' + this.players[i].getLevel() + '\n', function (err) {
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
        }
        /*bot.sendMessage({
            to: channelID,
            message: userID + ' has leveled up!'
        });*/
    }
    getInFight(userID)
    {
        for (var i = 0; i < this.players.length; i++) 
        {
            if (this.players[i].getName() == userID)
            {
                return this.players[i].getInFight();
                break;
            }
        }
    }
    setInFight(userID, value)
    {
        for (var i = 0; i < this.players.length; i++) 
        {
            if (this.players[i].getName() == userID)
            {
                this.players[i].setInFight(value);
                break;
            }
        }
		
		this.updateFile();
    }
    printAll(channelID)
    {
        for (var i = 0; i < this.players.length; i++) 
        {
            bot.sendMessage({
                to: channelID,
                message: this.players[i].getName() + ' --> Level: ' + this.players[i].getLevel() + ' --> Currently in battle? ' + this.players[i].getInFight()
            });
        }
    }
}

class DBUser 
{
    constructor(name, level, inFight) 
    {
        this.name = name;
        this.level = level;
        this.inFight = inFight;
    }
    getName()
    {
        return this.name;    
    }
    getLevel()
    {
        return this.level;
    }
    getInFight()
    {
        return this.inFight;
    }
    incrementLevel()
    {
        this.level++;
    }
    setInFight(value)
    {
        this.inFight = value;
    }
}

var playerDatabase = new DBUserDatabase();


bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
	var fs = require('fs');
	if (fs.readFileSync('user_data.txt').toString() != ''){
		playerDatabase.readFromFile();
	}
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
				bot.sendMessage({
					to: channelID,
					message: userID + ' has leveled up!'
				});
            }
            break;
            case 'everyone':
            {
                playerDatabase.printAll(channelID);
            }
            break;
            case 'start':
            {
                playerDatabase.setInFight(userID, true);
            }
            break;
            case 'leaderboard':
            {
                playerDatabase.printLeaderboard(channelID);
            }
            break;
			//tutorial
			case 'tutorial':
				switch(cmd2){
					//Tutorial 1
					case '1':
						bot.sendMessage({
							to: channelID,
							message: 'Print Statements: ```python\nprint(\'Your Message\')\n```\noutput: Your Message\nor: ```python\nprint(\'Your\', \'Message\')\n```\noutput: Your Message Variable Assignment: ```python\nvar_name = value\nprint(var_name)\n``` output: value'
						});
					break;
					case '2':
						bot.sendMessage({
							to: channelID,
							message: 'Variable Types:\nboolean: True or False\ninteger: a whole number\nfloat: a decimal\nstring: any word or words\n\nOperators:\n+: adds two values\n-: subtracts two values\n*: multiplies two values\n/: divides two values\n==: returns if two things on either side are equal\n!=: returns if two things are not equal\nExamples:\n```python\na = True\nb = 1\nc = 2\nd = b + c\ne = b / c\nprint(b == c)\nprint(b * e)\n print(d != e)\n```\noutput:\nFalse\n0.5\nTrue'
						});
					break;
					//Tutorial 2
					case '3':
						bot.sendMessage({
							to: channelID,
							message: 'If/Else Statements: ```python\nif case1:\n\t#whatever you want to happen\nelif case2:\n\t#whatever you want to happen if case1 is false, but case2 is true\nelse:\n\t#whatever you want to happen if case1 and case2 are both false/n```'
						});
					break;
					//Tutorial 4
					case '4':
						bot.sendMessage({
							to: channelID,
							message: 'While Loops: ```python\nwhile case1:\n\t#whatever you want to happen until case1 is false\n```\nFor Loops: ```python\nfor i in range(n):\n\t#whatever you want to run n times\n```'
						});
					break;
					//Tutorial 5
					case '5':
						bot.sendMessage({
							to: channelID,
							message: 'Functions: ```python\ndef func_name(args):\n\t#whatever the function does\n```'
						});
					break;
					//If no number entered, or number is out of range
					default:
						bot.sendMessage({
							to: channelID,
							message: 'Add a number after tutorial \nTutorial 1 is print statements and variable assignment\nTutorial 2 is variable types and operators\nTutorial 3 is if/else statements \nTutorial 4 is loops \nTutorial 5 is functions'
						});
					break;
				}
            break;
            // Just add any case commands if you want to..
         }
     }
});