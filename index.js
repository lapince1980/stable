/*
	Copyright 2018-2020 DARiOX					https://dariox.club
	Copyright 2019-2020 SeedBot Contributers	https://seedbot.xyz
*/


//			Check if node mdoules are installed
const fs = require("fs");
if (!fs.existsSync("node_modules/")) {
	console.log("Node Modules were not installed, try `npm i`");
	process.exit(1);
}

const signale = require("signale");
console.clear();
function getDirectories(path) {
  return fs.readdirSync(path).filter(function (file) {
    return fs.statSync(path+'/'+file).isDirectory();
  });
}

var moduleArray = getDirectories("modules/");
var viableModules = [];

//			Check each of the directories in "modules/" if they have a "manifest.json" file.
moduleArray.forEach(async (m) => {
	let tmpManiLoc = `modules/${m}/manifest.json`;
	if (!fs.existsSync(tmpManiLoc)) {
		signale.note(`[modman] no manifest found for "${m}" in "${tmpManiLoc}"`);
	} else {
		viableModules.push(`modules/${m}`);
	}
})

//			If there are no valid modules quit process.
if (viableModules.length < 1) {
	signale.log("[modman] No valid modules found.");
	process.exit(0);
}

//			Check if manifest for the module is valid
viableModules.forEach(async (m) => {
	try {
		var json = require(`./${m}/manifest.json`).name;
	} catch (e) {
		// JSON Invalid
		switch (e.code) {
			case "MODULE_NOT_FOUND":
				signale.fatal("invalid location? but we checked that in lines 26 to 33, huh. you probably should tell the developers that.");
				process.exit(69);
				break;
			default:
				console.log(e);
				signale.fatal(`[modman] Manifest is invalid at "${m}/manifest.json"`);
				viableModules.splice(j);
				break;
		}
		console.error(e)
	}
	delete(jsontemp);

})

//			Check if any of the modules are libraries and if they are, remove them from the viableModules array.
var botModulesToLoad = [];var genericModulesToLoad = [];var libraries = []; let tmparr;
viableModules.forEach(async (m) => {
	try {
		let jsontemp = require(`./${m}/manifest.json`);
		let filepush = `${m}/${jsontemp.main}`;
		//console.log(`[${m.indexOf('example') !== -1}] ${m}`)
		if (m.indexOf('example') !== -1 || m.indexOf('test') !== -1) {
			signale.warn("Example Module Detected, Not Loading.");
			jsontemp.type = "example";
			return;
		}
		switch (jsontemp.type) {
			case "botmod":
				 tmparr = JSON.parse(`{"name": "${jsontemp.name}","main": "${jsontemp.main}","location":"${m}"}`);
				botModulesToLoad.push(tmparr);
				delete(tmparr);
				break;
			case "generic":
				 tmparr = JSON.parse(`{"name": "${jsontemp.name}","main": "${jsontemp.main}","location":"${m}"}`);
				genericModulesToLoad.push(tmparr);
				delete(tmparr);
				break;
			case "library":
				//libLoaded(m);
				tmparr = JSON.parse(`{"name": "${jsontemp.name}","main": "${jsontemp.main}","location":"${m}"}`);
				libraries.push(tmparr);
				delete(tmparr);
				break;
			default:
				signale.warn(`[modman] Unknown Module type at "${m}/manifest.json"`);
				break;
		}
	} catch(e) {
		signale.error("[modman] An Error Occoured while sorting modules.");
		console.error(e);
	}
})



//			Load Discord Bot Modules
var token;
libraries.forEach(async (m) => {
	if (m.name === "core") {
		// Setup the token varaible for the modules (if they are needed, in most cases they are.)
		var corelib = require(`./${m.location}/${m.main}`)
		token = corelib.tokenManager()
		global.SB_TokenFunction = corelib.tokenManager();
		global.SB_Token = corelib.tokenManager();
		global.SB_Libraries = libraries;
		corelib.consoleInit()
	}
})

require('events').EventEmitter.defaultMaxListeners = 255

//			Discord Setup Stuff
const Discord = require('discord.js');
const client = new Discord.Client();
client.login(token.discord()).catch(async function (e) {
	switch(e.code) {
		case "SELF_SIGNED_CERT_IN_CHAIN":
			signale.error("Self-Signed certificate found in chain.");
			process.exit(1);
			break;
		default:
			console.log(e);
			process.exit(1);
			break;
	}
});



//			yay, we're finally at this point where if something fucks up its the module developers fault!
global.SB_Client = client;
global.SB_Package = require("./package.json");
botModulesToLoad.forEach(async (m) => {
	botModuleConsole.attemptLoad(m.name);
	var runDiscordModule = require(`./${m.location}/${m.main}`)
	runDiscordModule();
});
genericModulesToLoad.forEach(async (m) => {
	genericModuleConsole.attemptLoad(m.name)
    var runDiscordModule = require(`./${m.location}/${m.main}`);
	runDiscordModule();
});
