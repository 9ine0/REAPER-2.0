const Discord = require("discord.js");

module.exports = {
    name: "helputility",
    description: "Get Utility Commands",
    run: async (client, message, args) => {
        const embed = new Discord.MessageEmbed()
        .setTitle("Utility Commands")
        .setDescription("`addemoji`, `avatar`, `announce`, `clear`, `createrole`, `delchannel`, `delrole`, `emoji`, `enlargemoji`, `esay`, `giverole`, `google`, `lock`, `newtext`, `newvoice`, `nickname`, `poll`, `removerole`, `say`, `servericon`, `suggestion`, `timedlockdown`, `unlock`, `weather`, `wiki`, `youtube`")
        .setColor("RANDOM");

        message.channel.send(embed);
    }
}
