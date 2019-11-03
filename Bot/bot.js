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
	hasUser(userID) {
		var userInList = false;
		for (var i = 0; i < this.players.length; i++) {
			if (this.players[i].getName() == userID) {
				userInList = true
			}
		}
		return userInList;
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
	getUserLevel(userID)
    {
        for (var i = 0; i < this.players.length; i++) 
        {
            if (this.players[i].getName() == userID)
            {
                return this.players[i].getLevel();
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
	 getInFight()
    {
        return this.inFight;
    }
	setInFight(value)
    {
        this.inFight = value;
    }
}
class RunCode {
	
	runPython(code, level) {
		code = code.substring(9,code.length-3).trim();
		var fs = require('fs');
		
		if (level == 1) {
			console.log("Entered level 1");
			fs.writeFile('pythonCode.py', code, function (err, file) {
				if (err) throw err;
			});
		}
		else if (level == 2) {
			console.log("Entered level 2");
			fs.writeFile('pythonCode.py', "lostCoins = 4128975847\n", function (err, file) {
				if (err) throw err;
			});
			fs.appendFile('pythonCode.py', code, function (err, file) {
				if (err) throw err;
			});
		}
		
		const { exec } = require('child_process');
		exec('python pythonCode.py > userOutput.txt', (err, stdout, stderr) => {
			if (err) {
				//some err occurred
				console.error(err)
				return err;
			}
			else {
				// the *entire* stdout and stderr (buffered)
				console.log(`stdout: ${stdout}`);
				console.log(`stderr: ${stderr}`);
			}
		});
		
		var fsIn = require('fs');
		var userOut = fsIn.readFileSync('userOutput.txt').toString();
		console.log(userOut);
		return userOut;
	}
	
}

var playerDatabase = new DBUserDatabase();
var runUserCode = new RunCode();
var output;
var answer;

bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});

bot.on('message', function (user, userID, channelID, message, evt) {
	
	//User input answers to the problems
	if (playerDatabase.getInFight(userID) == true && message != "!cancel") {
		if (message.substring(0,9) == "```python" && message.endsWith("```")) {
			bot.sendMessage({
				to: channelID,
				message: 'I read that input as: ' + message.substring(9,message.length-3)
			});
			//Problem 1
			if (playerDatabase.getUserLevel(userID) == 1) {
				answer = "Begone slime!\r\n";
				output = runUserCode.runPython(message, 1);
				
				bot.sendMessage({
					to: channelID,
					message: 'The output I got is: ' + output
				});
				if (output == answer) {
					bot.sendMessage({
							to: channelID,
							message: 'The slime got scared and ran off! You leveled up!'
						});
					playerDatabase.levelUp(userID);
					playerDatabase.setInFight(userID, false);
				}
			}
			//Problem 2
			else if (playerDatabase.getUserLevel(userID) == 2) {
				answer = "You lost 4128975847 coins\r\n";
				output = runUserCode.runPython(message, 2);
				bot.sendMessage({
					to: channelID,
					message: 'The output I got is: ' + output
				});
				if (output == answer) {
					bot.sendMessage({
							to: channelID,
							message: 'You successfully counted the lost coins! The goblin thanks you with a Bottle O\' Enchanting. You leveled up!'
						});
					playerDatabase.levelUp(userID);
					playerDatabase.setInFight(userID, false);
				}
			}
		}
		else {
			bot.sendMessage({
				to: channelID,
				message: 'Formatted incorrectly! Make sure your message starts with "\\`\\`\\`python" and ends with "\\`\\`\\`". If you want to cancel, just type "!cancel"'
			});
		}
	}
	
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    else if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
        
        args = args.splice(1);
        switch(cmd) {
            // !ping
            case 'help':
                bot.sendMessage({
                    to: channelID,
                    message: 'List of commands:\n!help: list of commands \n!start: starts a round of the rpg'
                });
            break;
            case 'start':
				if (playerDatabase.getInFight(userID) == true) {
					bot.sendMessage({
						to: channelID,
						message: 'You are currently in a fight! Type !cancel to run away.'
					});
				}
				else {
					if (!playerDatabase.hasUser(userID)) {
						playerDatabase.addPlayer(userID);
					}
					playerDatabase.setInFight(userID, true);
					
					if (playerDatabase.getUserLevel(userID) == 1) {
						bot.sendMessage({
							to: channelID,
							message: 'A slime appears! However, it seems a bit nervous. Print "Begone slime!" and it should flee!'
						});
					}
					else if (playerDatabase.getUserLevel(userID) == 2) {
						bot.sendMessage({
							to: channelID,
							message: 'A goblin appears! He seems friendly, though. He spilled some gold coins from his bag, and needs help counting how much he dropped! For some reason, he keeps saying the variable name for the coins is "lostCoins" and that it is already intialized- whatever that means. Be a good samaritan and tell him "You lost \\_\\_\\_\\_\\_ coins"'
						});
					}
					else if (playerDatabase.getUserLevel(userID) == 3) {
						bot.sendMessage({
							to: channelID,
							message: ''
						});
					}
					else if (playerDatabase.getUserLevel(userID) == 4) {
						bot.sendMessage({
							to: channelID,
							message: ''
						});
					}
					else if (playerDatabase.getUserLevel(userID) == 5) {
						bot.sendMessage({
							to: channelID,
							message: ''
						});
					}
					else if (playerDatabase.getUserLevel(userID) == 6) {
						bot.sendMessage({
							to: channelID,
							message: ''
						});
					}
					else if (playerDatabase.getUserLevel(userID) == 7) {
						bot.sendMessage({
							to: channelID,
							message: ''
						});
					}
					else if (playerDatabase.getUserLevel(userID) == 8) {
						bot.sendMessage({
							to: channelID,
							message: ''
						});
					}
				}
			break;
			case 'cancel':
				playerDatabase.setInFight(userID, false);
			break;
         }
     }
});


//os.system(python user.py > output.txt);