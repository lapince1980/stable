const Discord = require("discord.js");
const { RichEmbed } = require("discord.js");
const response = require("./response.json");
module.exports.cmd = function(message) {
	let evalEmbed = new Discord.MessageEmbed()
		.setColor(SB_CoreLibrary.misc_randHex())
		.setTitle(response.invite.title)
		.setDescription(response.invite.desc)
		.setTimestamp()
	message.channel.send(evalEmbed);
}
