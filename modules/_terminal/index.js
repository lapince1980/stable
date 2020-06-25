var inquirer = require("inquirer");
const { Signale } = require("signale");

module.exports = function(a,b,c) {
    SB_Client = a;
    SB_TokenFunction = b;
    SB_Libraries = c;

    if(process.argv.indexOf("--debug") > -1){
        SB_Client.on('ready', () => {
            termcon.warmingUp("Waiting a tad bit before launching the Developer Console.");
            setTimeout(function(a,b,c) {
                termcon.info("Welcome to SeedBot Terminal v" + require("./manifest.json").version)
                termHandle(a,b,c);
            }, 2500)
        })
    }
}

async function termHandle() {
    inquirer.prompt([
        {
            type: "text",
            message: "> ",
            name: 'termInput'
        }
    ]).then(ans => {
        commandHandler(ans.termInput.split(" "));
    }).catch(error => {
        signale.error(new Error(error));
        process.exit();
    })
}

function commandHandler(cmd) {

    // check if the command is valid

    let validCommands = require("./commands.json").commands;
    var cmdFunc = require("./commandHandle.js");

    if (validCommands.indexOf(cmd[0]) > -1){
        //command is valid
        switch (cmd[0]) {
            case "list":
            case "get":
            case "print":
                cmdFunc.print(cmd);
                break;
            case "set":
                cmdFunc.set(cmd);
                break;
            case "eval":
            case "run":
                cmdFunc.eval(cmd);
                break;
            case "exit":
            case "quit":
                termcon.seeya()
                process.exit();
                break;
            default:
                console.error(new Error());
                process.exit(0);
                break;
        }
    } else {
        //command is invalid
        termcon.invalidCommand()
        return false;
    }

}