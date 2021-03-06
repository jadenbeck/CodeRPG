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
           
                str += "\n"+ (i+1) + ': ' + this.players[i].getUserName() + ' --> Level: ' + this.players[i].getLevel()
            
        }
          bot.sendMessage({
            to: channelID,
            message: str
            });
    }
	readFromFile(){
		var fs = require('fs');
		var lines = fs.readFileSync('user_data.txt').toString().split("\n");
		for (var i = 0; i < lines.length; i++){
			if (lines[i] != ''){
			var splitted = lines[i].split(" --> Level: ");
			var split2 = splitted[1].split(' ')
				this.players[this.players.length] = new DBUser(splitted[0],split2[0],false, split2[1]);
			}
		}
	}
	updateFile()
	{
		const fs = require('fs');
		fs.writeFileSync('user_data.txt', '', function (err, file) {
			if (err) throw err;
			});
        for (var i = 0; i < this.players.length; i++) 
        {
			fs.appendFileSync('user_data.txt', this.players[i].getName() + ' --> Level: ' + this.players[i].getLevel() + ' ' +this.players[i].getUserName() + '\n', function (err) {
			});   
        }
    }
    addPlayer(DBUsername, name)
    {
		if (!this.hasUser(DBUsername)) {
			this.players[this.players.length] = new DBUser(DBUsername, 1, false, name);
			this.updateFile();
		}
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
		
		this.updateFile();
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
                message: this.players[i].getName() + ' --> Level: ' + this.players[i].getLevel()
            });
        }
    }
	setAll(channelID, level) {
		for (var i = 0; i < this.players.length; i++) 
        {
			this.players[i].setLevel(level);
        }
		bot.sendMessage({
                to: channelID,
                message: "Set every player's levels to " + level
            });
	}
    hasUser(userID)
    {
    	var exists = false;
    	for (var i = 0; i < this.players.length; i++) 
        {
            if (userID == this.players[i].getName()) {
            	exists = true;
			}
        }
        return exists;
    }
    getUserLevel(userID)
    {
    	for (var i = 0; i < this.players.length; i++) 
        {
            if (this.players[i].getName() == userID)
            {
                return this.players[i].getLevel();
            }
        }
    }
}

class DBUser 
{
    constructor(name, level, inFight, userName) 
    {
        this.name = name;
        this.level = level;
        this.inFight = inFight;
        this.userName = userName;
    }
    getName()
    {
        return this.name;    
    }
    getUserName()
    {
    	return this.userName;
    }
    getLevel()
    {
        return this.level;
    }
	setLevel(num) {
		this.level = num;
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

class RunCode {
	
	wait(ms)
	{
		var d = new Date();
		var d2 = null;
		do { d2 = new Date(); }
		while(d2-d < ms);
	}
	
	gradeQuestion(code, level) {
		
	}
	
	runPython(code, level) {
		code = "ab83fb362bfi27fba3 = 0\n" + code.substring(9,code.length-3).trim();
		var lines = code.split("\n");
		for (var i = 0; i < lines.length; i++) {
			//The following are just temporary fixes for these issues, we should find a more concrete solution in the future
			if (lines[i].includes("for") || lines[i].includes("while")) {
				lines.splice(i+1, 0, '    ab83fb362bfi27fba3 += 1');
				lines.splice(i+2, 0, '    if (ab83fb362bfi27fba3 > 100):');
				lines.splice(i+3, 0, '    \tbreak');
			}
			if (lines[i].includes("input(")) {
				lines.splice(i,1);
				i -= 1
			}
		}
		code = ""
		for (var i = 0; i < lines.length; i++) {
			code += lines[i] + '\n'
		}
		var fs = require('fs');
		
		if (level == 1 || level == 3 || level == 4) {
			console.log("Entered level " + level);
			fs.writeFileSync('pythonCode.py', code, function (err, file) {
				if (err) throw err;
			});
		}
		else if (level == 2) {
			console.log("Entered level 2");
			fs.writeFileSync('pythonCode.py', "lostCoins = 4128975847\n", function (err, file) {
				if (err) throw err;
			});
			fs.appendFileSync('pythonCode.py', code, function (err, file) {
				if (err) throw err;
			});
		}
		else if (level == 5) {
			console.log("Entered level 5");
			fs.writeFileSync('pythonCode.py', "x = 692\ny = 134\n", function (err, file) {
				if (err) throw err;
			});
			fs.appendFileSync('pythonCode.py', code, function (err, file) {
				if (err) throw err;
			});
		}
		else if (level == 6) {
			console.log("Entered level 6");
			fs.writeFileSync('pythonCode.py', "x = 37\n", function (err, file) {
				if (err) throw err;
			});
			fs.appendFileSync('pythonCode.py', code, function (err, file) {
				if (err) throw err;
			});
			fs.appendFileSync('pythonCode.py', "\nx = 101\n", function (err, file) {
				if (err) throw err;
			});
			fs.appendFileSync('pythonCode.py', code, function (err, file) {
				if (err) throw err;
			});

		}
		else if (level > 6 && level < 12) {
			console.log("Entered level " + level);
			if (level == 7) {
				code = 'is_not_free = False\n' + code;
			}
			else if (level == 10) {
				code = code + '\nprint(calculate_grades(95,98,96.5,100))';
			}
			else if (level == 11) {
				code = code + '\nprint(find_area(6,7))';
			}
			fs.writeFileSync('pythonCode.py', "", function (err, file) {
				if (err) throw err;
			});
			fs.appendFileSync('pythonCode.py', code, function (err, file) {
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
			}
		});
		
		this.wait(500);
		
		var fsIn = require('fs');
		var userOut = fsIn.readFileSync('userOutput.txt');
		userOut = userOut.toString();
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
	var fs = require('fs');
	if (fs.readFileSync('user_data.txt').toString() != ''){
		playerDatabase.readFromFile();
	}
});

bot.on('message', function (user, userID, channelID, message, evt) {
	
	//User input answers to the problems
	if (playerDatabase.getInFight(userID) == false && message.substring(0,1) != '!') {
		if (message.toLowerCase().includes("thanks coderpg")) {
			bot.sendMessage({
				to: channelID,
				message: 'No problem, ' + user + '!'
			});
		}
		if (message.toLowerCase().includes("coderpg sucks")) {
			bot.sendMessage({
				to: channelID,
				message: 'No u ' + user + ' :angry:'
			});
		}
		if (message.toLowerCase().includes("love coderpg") || message.toLowerCase().includes("love you coderpg")) {
			bot.sendMessage({
				to: channelID,
				message: ':kissing_heart:'
			});
		}
	}
	if (playerDatabase.getInFight(userID) == true && message != "!cancel") {
		if (message.substring(0,9) == "```python" && message.endsWith("```")) {
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
				else if (output == '')
				{
					bot.sendMessage({
							to: channelID,
							message: 'Your code had no output. Make sure your code is formatted properly! Try again!'
						});
				}
				else
				{
					bot.sendMessage({
							to: channelID,
							message: 'The output does not match the sample. Try again!'
						});
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
				else if (output == '')
				{
					bot.sendMessage({
							to: channelID,
							message: 'Your code had no output. Make sure your code is formatted properly! Try again!'
						});
				}
				else
				{
					bot.sendMessage({
							to: channelID,
							message: 'The output does not match the sample. Try again!'
						});
				}
			}
			//Problem 3
			else if (playerDatabase.getUserLevel(userID) == 3) {
				answer = "There are 5 bananas\r\n";
				output = runUserCode.runPython(message, 3);
				bot.sendMessage({
					to: channelID,
					message: 'The output I got is: ' + output
				});
				msg = message.substring(9,message.length-3).replace(/\s+/g, "");
				if (output == answer && msg.includes("bananas=5")) {
					bot.sendMessage({
							to: channelID,
							message: 'The monkey rewards you with the map and you escape the rainforest! You leveled up!'
					});
					playerDatabase.levelUp(userID);
					playerDatabase.setInFight(userID, false);
				}
				else if (output == '')
				{
					bot.sendMessage({
							to: channelID,
							message: 'Your code had no output. Make sure your code is formatted properly! Try again!'
						});
				}
				else
				{
					bot.sendMessage({
							to: channelID,
							message: 'The output does not match the sample. Try again!'
						});
				}
			}
			//Problem 4
			else if (playerDatabase.getUserLevel(userID) == 4) {
				answer = "True Sally 7\r\n";
				output = runUserCode.runPython(message, 4);
				bot.sendMessage({
					to: channelID,
					message: 'The output I got is: ' + output
				});
				msg = message.substring(9,message.length-3).replace(/\s+/g, "");
				if (output == answer && msg.includes("bones=True") && msg.includes('name="Sally"')&& msg.includes("apples=7")) {
					bot.sendMessage({
							to: channelID,
							message: 'You escape the skeleton and level up!'
					});
					playerDatabase.levelUp(userID);
					playerDatabase.setInFight(userID, false);
				}
				else if (output == '')
				{
					bot.sendMessage({
							to: channelID,
							message: 'Your code had no output. Make sure your code is formatted properly! Try again!'
						});
				}
				else
				{
					bot.sendMessage({
							to: channelID,
							message: 'The output does not match the sample. Try again!'
						});
				}
			}
			//Problem 5
			else if (playerDatabase.getUserLevel(userID) == 5) {
				answer = "1652\r\n";
				output = runUserCode.runPython(message, 5);
				bot.sendMessage({
					to: channelID,
					message: 'The output I got is: ' + output
				});
				if (output == answer) {
					bot.sendMessage({
							to: channelID,
							message: 'You enter the temple and retrieve the relics, 6 and 13 years old. You leveled up!'
						});
					playerDatabase.levelUp(userID);
					playerDatabase.setInFight(userID, false);
				}
				else if (output == '')
				{
					bot.sendMessage({
							to: channelID,
							message: 'Your code had no output. Make sure your code is formatted properly! Try again!'
						});
				}
				else
				{
					bot.sendMessage({
							to: channelID,
							message: 'The output does not match the sample. Try again!'
						});
				}
			}
			//Problem 6
			else if (playerDatabase.getUserLevel(userID) == 6) {
				answer = "Correct\r\nIncorrect\r\n";
				output = runUserCode.runPython(message, 6);
				bot.sendMessage({
					to: channelID,
					message: 'The output I got is: ' + output
				});
				if (output == answer) {
					bot.sendMessage({
							to: channelID,
							message: 'You escape the bitter cold of the wintry tundra and conveniently earn 10,000 gold coins! You leveled up!'
						});
					playerDatabase.levelUp(userID);
					playerDatabase.setInFight(userID, false);
				}
				else if (output == '')
				{
					bot.sendMessage({
							to: channelID,
							message: 'Your code had no output. Make sure your code is formatted properly! Try again!'
						});
				}
				else
				{
					bot.sendMessage({
							to: channelID,
							message: 'The output does not match the sample. Try again!'
						});
				}
			}
			//Probelm 7
			else if (playerDatabase.getUserLevel(userID) == 7) {
				answer = "Freedom!\r\n";
				output = runUserCode.runPython(message, 7);
				bot.sendMessage({
					to: channelID,
					message: 'The output I got is: ' + output
				});
				if (output == answer && message.includes('if')) {
					bot.sendMessage({
							to: channelID,
							message: 'You successfully freed the genie and got the water you needed! You leveled up!'
						});
					playerDatabase.levelUp(userID);
					playerDatabase.setInFight(userID, false);
				}
				else if (output == '')
                {
                    bot.sendMessage({
                            to: channelID,
                            message: 'Your code had no output. Make sure your code is formatted properly! Try again!'
                        });
                }else if (output == answer){
					bot.sendMessage({
                            to: channelID,
                            message: 'Please use a if/else statement!'
                        });
                }
                else
                {
                    bot.sendMessage({
                            to: channelID,
                            message: 'The output does not match the sample. Try again!'
                        });
                }
			}
			//Problem 8
			else if (playerDatabase.getUserLevel(userID) == 8) {
				answer = "1\r\n2\r\n3\r\n4\r\n5\r\n6\r\n7\r\n8\r\n9\r\n10\r\n11\r\n12\r\n13\r\n14\r\n15\r\n16\r\n17\r\n18\r\n19\r\n20\r\n21\r\n22\r\n23\r\n24\r\n25\r\n";
				output = runUserCode.runPython(message, 8);
				bot.sendMessage({
					to: channelID,
					message: 'The output I got is: ' + output
				});
				if (output == answer && (message.includes('for') || message.includes('while'))) {
					bot.sendMessage({
							to: channelID,
							message: 'You successfully got past the Sith and saved the galaxy! You leveled up!'
						});
					playerDatabase.levelUp(userID);
					playerDatabase.setInFight(userID, false);
				}
				else if (output == '')
                {
                    bot.sendMessage({
                            to: channelID,
                            message: 'Your code had no output. Make sure your code is formatted properly! Try again!'
                        });
                }else if (output == answer){
					bot.sendMessage({
                            to: channelID,
                            message: 'Please use a loop!'
                        });
                }
                else
                {
                    bot.sendMessage({
                            to: channelID,
                            message: 'The output does not match the sample. Try again!'
                        });
                }
			}
			//Problem 9
			else if (playerDatabase.getUserLevel(userID) == 9) {
				answer = "1\r\n1\r\n2\r\n3\r\n5\r\n8\r\n13\r\n21\r\n34\r\n55\r\n89\r\n144\r\n233\r\n377\r\n610\r\n";
				output = runUserCode.runPython(message, 9);
				bot.sendMessage({
					to: channelID,
					message: 'The output I got is: ' + output
				});
				if (output == answer && (message.includes('for') || message.includes('while'))) {
					bot.sendMessage({
							to: channelID,
							message: 'You saved your grade! You leveled up!'
						});
					playerDatabase.levelUp(userID);
					playerDatabase.setInFight(userID, false);
				}
				else if (output == '')
                {
                    bot.sendMessage({
                            to: channelID,
                            message: 'Your code had no output. Make sure your code is formatted properly! Try again!'
                        });
                }else if (output == answer){
					bot.sendMessage({
                            to: channelID,
                            message: 'Please use a loop!'
                        });
                }
                else
                {
                    bot.sendMessage({
                            to: channelID,
                            message: 'The output does not match the sample. Try again!'
                        });
                }
			}
			//Problem 10
			else if (playerDatabase.getUserLevel(userID) == 10) {
				message = message;
				answer = "97.375\r\n";
				output = runUserCode.runPython(message, 10);
				bot.sendMessage({
					to: channelID,
					message: 'The output I got is: ' + output
				});
				if (output == answer) {
					bot.sendMessage({
							to: channelID,
							message: 'SISman finally told you your grade! You leveled up!'
						});
					playerDatabase.levelUp(userID);
					playerDatabase.setInFight(userID, false);
				}
				else if (output == '')
                {
                    bot.sendMessage({
                            to: channelID,
                            message: 'Your code had no output. Make sure your code is formatted properly! Try again!'
                        });
                }
                else
                {
                    bot.sendMessage({
                            to: channelID,
                            message: 'The output does not match the sample. Try again!'
                        });
                }
			}
			//Problem 11
			else if (playerDatabase.getUserLevel(userID) == 11) {
				message = message;
				answer = "42\r\n";
				output = runUserCode.runPython(message, 11);
				bot.sendMessage({
					to: channelID,
					message: 'The output I got is: ' + output
				});
				if (output == answer) {
					bot.sendMessage({
							to: channelID,
							message: 'You got an A in math! You leveled up!'
						});
					playerDatabase.levelUp(userID);
					playerDatabase.setInFight(userID, false);
				}
				else if (output == '')
                {
                    bot.sendMessage({
                            to: channelID,
                            message: 'Your code had no output. Make sure your code is formatted properly! Try again!'
                        });
                }
                else
                {
                    bot.sendMessage({
                            to: channelID,
                            message: 'The output does not match the sample. Try again!'
                        });
                }
			}
		}
		//Message formatted wrong
		else {
			bot.sendMessage({
				to: channelID,
				message: 'Formatted incorrectly! Make sure your message starts with "\\`\\`\\`python" and ends with "\\`\\`\\`". Your code should look like the following:\n\n\\`\\`\\`python\nprint("Hello world!")\n\\`\\`\\`\n\n If you want to cancel, just type "!cancel"'
			});
		}
	}
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    else if (message.substring(0, 1) == '!') {
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
                    message: 'List of commands:\n__!help__: list of commands \n__!start__: starts a round of the RPG based on your level\n__!cancel__: cancels current round of RPG\n__!leaderboard__: prints leaderboard \n!__tutorial__: prints list of tutorials (0-5) \n__!tutorial 0__: tutorial on how to format your answers \n__!tutorial 1__: tutorial for print statements and variable declaration \n__!tutorial 2__: tutorial for variable types and operations \n__!tutorial 3__: tutorial for conditional statements \n__!tutorial 4__: tutorial for loops \n__!tutorial 5__: tutorial for implementing functions'
                });
            }
            break;
			case 'leaderboard':
            {
                playerDatabase.printLeaderboard(channelID);
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
					//Tutorial 0
					case '0':
						bot.sendMessage({
							to: channelID,
							message: '**Entering your responses:**\nWhen you try to progress through the game and give an answer to a problem, your code should look like the following:\n\n\\`\\`\\`python\nprint("Hello world!")\n\\`\\`\\`\n\nThis will format your code correctly, making it easier to read, and is required for the game to function.'
						});
					break
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
							message: 'Variable Types:\nboolean: True or False\ninteger: a whole number\nfloat: a decimal\nstring: any word or words\n\nOperators:\n+: adds two values\n-: subtracts two values\n*: multiplies two values\n/: divides two values\nThe following values return a boolean (True or False):\n==: returns if two things on either side are equal\n!=: returns if two things are not equal\n<: returns if a value is less than another\n>: returns if a value is greater than another\n<=: returns if a value is less than or equal to another\n>=: returns if a value is greater than or equal to another\nExamples:\n```python\na = True\nb = 1\nc = 2\nd = b + c\ne = b / c\nprint(b == c)\nprint(b * e)\nprint(d != e)\nprint(c > b)\nprint(c < b)\n```\noutput:\nFalse\n0.5\nTrue\nTrue\nFalse'
						});
					break;
					//Tutorial 3
					case '3':
						bot.sendMessage({
							to: channelID,
							message: 'If/Else Statements: ```python\nif case1:\n\t#Whatever you want to happen if case1 is true\n\t#There may be however many lines you like here, as long as they are indented\nelif case2:\n\t#Whatever you want to happen if case1 is false but case2 is true\n\t#There may be however many lines you like here, as long as they are indented\nelse:\n\t#Whatever you want to happen if case1 and case2 are false\n\t#There may be however many lines you like here, as long as they are indented\n```\nNote: case1 and case2 are booleans or conditionals'
						});
					break;
					//Tutorial 4
					case '4':
						bot.sendMessage({
							to: channelID,
							message: 'While Loops: ```python\nwhile case1:\n\t#Whatever you want to happen until case1 is false\n\t#There may be however many lines you like here, as long as they are indented\n```\nFor Loops: ```python\nfor i in range(n):\n\t#Whatever you want to run n times\n\t#There may be however many lines you like here, as long as they are indented\n```\nNote: case1 is a boolean or conditional'
						});
					break;
					//Tutorial 5
					case '5':
						bot.sendMessage({
							to: channelID,
							message: 'Functions: ```python\ndef func_name(args):\n\t#Whatever the function does\n\t#There may be however many lines you like here, as long as they are indented\n\treturn 5\n```\nWhere args are variable names to be used in the function and func_name is the name of the function. The function "returns" a value, which in this case is 5. In this case, print(func_name(args)) would print out "5"'
						});
					break;
					//If no number entered, or number is out of range
					default:
						bot.sendMessage({
							to: channelID,
							message: 'Add a number after tutorial \n__Tutorial 0__: How to format your answers\n__Tutorial 1__: print statements and variable assignment\n__Tutorial 2__: variable types and operators\n__Tutorial 3__: if/else statements \n__Tutorial 4__: loops \n__Tutorial 5__: functions'
						});
					break;
				}
            break;
            case 'start':
				if (playerDatabase.getInFight(userID) == true) {
					bot.sendMessage({
						to: channelID,
						message: 'You are currently in a fight! Type !cancel to run away.'
					});
				}
				else 
				{
					playerDatabase.addPlayer(userID, user);
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
							message: 'You are walking through the dense rainforest in the midst of night, lost, without any sense of direction. Suddenly, a monkey swings by, demanding five bananas, in return for a map which will help you escape your damp surroundings. Set the variable bananas to 5 and use the variable in a print statement so that it reads "There are 5 bananas".'
						});
					}
					else if (playerDatabase.getUserLevel(userID) == 4) {
						bot.sendMessage({
							to: channelID,
							message: 'There is an invincible skeleton walking towards you, and you\'ve realized you cannot escape unless you divert its attention with the correct variables! There\'s only one way to divert its attention, if bones is true, if name is "Sally" and if apples is 7. Set these three variables and print these variables in this order on a single line!'
						});
					}
					else if (playerDatabase.getUserLevel(userID) == 5) {
						bot.sendMessage({
							to: channelID,
							message: 'You approach the Temple of Ahuizotl and two guardian statues, clad in obsidian armor and holding mossy granite axes loom over you. You attempt to enter the desolate ancient structure, when suddenly, the axes come crashing down in front of you. The guardian statues speak: \nStatue 1: If treasure here is what you seek, \nStatue 2: Then solve this problem which we shall speak. \nStatue 1: To succeed you cannot be weak, \nStatue 2: But must be a Python geek! \nBoth: If the ages of the relics contained are x and y, then what is two times the sum of these variables. Using variables x and y, print this value!'
						});
					}
					else if (playerDatabase.getUserLevel(userID) == 6) {
						bot.sendMessage({
							to: channelID,
							message: 'The evening draws close, the tundra is freezing. The wind howls as it chills the unprotected skin of your face, and the trees above shade you from the little remaining sunlight. Your energy is fading and you need shelter. You need warmth, and time is running out. Luckily, you soon come across a cave, and heat emanates from within. Why? You don\'t know, but frankly, it doesn\'t matter. As you delve deeper into the cave, the darkness gives way to a glistening light, one which can only come from the most precious of metals--gold. You turn the corner, and your vision spans across the ocean of light, one which you had never expected within such darkness. Crowns, rings, coins, even the ancient artifact of Aeolus! And... a dragon. Sensing your presence, the dragon awakes. You turn to run, but the dragon quickly blocks your path and speaks. \nDragon: I am thinking of a number, x. I cannot tell you what it is, but if you write a certain program for me which prints "Correct" only if the number if less than 100, and "Incorrect" otherwise, I can let you stay here for the evening, and you will earn half of my gold coins. Be warned, I WILL test your code... and if you fail...'
						});
					}
					else if (playerDatabase.getUserLevel(userID) == 7) {
						bot.sendMessage({
							to: channelID,
							message: 'You are lost in the middle of the desert, and you are running low on water. Magically, you find a lamp and decide to rub it, hoping for a genie that way you can quench your thirst. Luckily the genie pops out of his lamp, but states that he is no ordinary genie. The genie tells you that he will give you what you most desire if you can code him out of being stuck back in the lamp after your three wishes. He gives you a hint, stating that you must make an if statement that takes the variable is_not_free and if it is not true, it must print "Freedom!".'
						});
					}
					else if (playerDatabase.getUserLevel(userID) == 8) {
						bot.sendMessage({
							to: channelID,
							message: 'In your many travels, you end up in space, where you have just stolen the Death Star plans. In order to escape, you must overload the Sith\'s computer system by printing the numbers 1 through 25 sequentially. But make your code brief, the Sith combatants are right on your tail!'
						});
					}
					else if (playerDatabase.getUserLevel(userID) == 9) {
						bot.sendMessage({
							to: channelID,
							message: 'Waking from your daydreams, you realize you are in math class and you teacher asked for the first 15 numbers from the Fibonacci sequence, and you don\'t have much time until the class is over! You need to quickly write a loop in order to to print the first 15 numbers, remember that the Fibonacci sequence is the number before it in the sequence added to the current number (ie. 1,1,2,3,5,...)'
						});
					}
					else if (playerDatabase.getUserLevel(userID) == 10) {
						bot.sendMessage({
							to: channelID,
							message: 'You are desperate to find out your grade, but SISman won\'t give you your average. SISman tells you he will give you the output if you give him a function called calculate_grades that takes four numbers as parameters and returns their sum divided by four'
						});
					}
					else if (playerDatabase.getUserLevel(userID) == 11) {
						bot.sendMessage({
							to: channelID,
							message: 'Bored in math class again, and don\'t want to calculate the area of a rectangle anymore. Write a function find_area that takes two integers and finds the area of a rectangle with that height and width.'
						});
					}
				}
			break;
			case 'cancel':
				playerDatabase.setInFight(userID, false);
				bot.sendMessage({
						to: channelID,
						message: 'Your current event has been canceled. You are now free to use any CodeRPG commands!'
					});
			break;
			//DEV FUNCTION: USE FOR DEMO
			case 'setallscores':
				cmd2 = parseInt(cmd2,10);
				playerDatabase.setAll(channelID, cmd2);
			break;
			default:
				bot.sendMessage({
							to: channelID,
							message: 'Unrecognized command. Use "!help" to learn about CodeRPG commands.'
						});
			break;
         }
     }
});