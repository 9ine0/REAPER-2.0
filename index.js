const { Client, Collection, MessageEmbed } = require("discord.js")

const fs = require("fs")
const client = new Client({
  disableEveryone: "true" // This makes sure that the bot does not mention everyone
});
client.commands = new Collection();
client.aliases = new Collection();
client.categories = fs.readdirSync("./Commands/")
const config = require("./config.json") // enter your bot prefix in the config.json file
const mongoose = require("mongoose")
const prefix = require("./Commands/Owner/models/prefix");

mongoose.connect(config.mongoPass, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

['command'].forEach(handler => {
  require(`./handler/${handler}`)(client);
})
client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}`)
})

client.on('ready', () => {
  client.user.setPresence({ status: 'online' });
  const activities_list = [
    { msg: "Infinity Rocks", type: "STREAMING" },
    { msg: "music for your server!", type: "PLAYING" },
    { msg: "=help", type: "LISTENING" },
    { msg: "Helping You make your Server Better", type: "PLAYING" },
    { msg: `with ${client.users.cache.size} users in ${client.guilds.cache.size} servers!`, type: "PLAYING" },
  ];// creates an arraylist containing phrases you want your bot to switch through.
  setInterval(() => {
    const index = Math.floor(Math.random() * (activities_list.length - 1) + 1); // generates a random number between 1 
      client.user.setActivity(activities_list[index].msg, {
        type: activities_list[index].type,
      }); // sets bot's activities to one of the phrases in the arraylist.
  }, 10000); // Runs this every 10 seconds.});
});

client.on('message', async (message) => {
  if (message.author.bot) return;

  //Getting the data from the model
  const data = await prefix.findOne({
    GuildID: message.guild.id
  });

  const messageArray = message.content.split(' ');
  const cmd = messageArray[0];
  const args = messageArray.slice(1);

  //If there was a data, use the database prefix BUT if there is no data, use the default prefix which you have to set!
  if (data) {
    const prefix = data.Prefix;

    if (!message.content.startsWith(prefix)) return;
    const commandfile = client.commands.get(cmd.slice(prefix.length)) || client.commands.get(client.aliases.get(cmd.slice(prefix.length)));
    commandfile.run(client, message, args);

  } else if (!data) {
    //set the default prefix here
    const prefix = config.DEFAULT_PREFIX;

    if (!message.content.startsWith(prefix)) return;
    const commandfile = client.commands.get(cmd.slice(prefix.length)) || client.commands.get(client.aliases.get(cmd.slice(prefix.length)));
    commandfile.run(client, message, args);
}
});
const welcomerData = require("./Commands/Owner/models/welcome")

client.on(`guildMemberAdd`, async(member)=>{

  const data = await welcomerData.findOne({
    GuildID: member.guild.id
  })
  if (data) {

  let embed = new MessageEmbed()
    .setTitle("Welcome!")
    .setDescription(`Welcome to the Server, ${member}! Hope you like our Server!`)
    .setColor("GREEN");

    let channel = data.Welcome

  member.guild.channels.cache.get(channel).send(embed);
  } else if (!data) {
    return;
  }
})


const byeData = require("./Commands/Owner/models/bye")

client.on(`guildMemberRemove`, async(member) => {

  const data = await byeData.findOne({
    GuildID: member.guild.id
  })

  if (data) {
    
    let embed = new MessageEmbed()
    .setTitle("Goodbye!")
    .setDescription(`${member} Just left the Server! Hope they return soon!`)
    .setColor("GREEN");

   let channel = data.Bye

  member.guild.channels.cache.get(channel).send(embed);
} else if (!data) {
  return;
}
})

client.on(`guildCreate`, guild =>{
  let defaultChannel = "";
  guild.channels.cache.forEach((channel) => {
    if (channel.type == "text" && defaultChannel == "") {
      if (channel.permissionsFor(guild.me).has("SEND_MESSAGES")) {
        defaultChannel = channel;
      }
    }
  })
  const embed = new MessageEmbed()
  .setTitle("Thanks for Inviting!")
  .setDescription("Hello Everyone, I am Infinity, A multi-purpose Discord Bot \n\nMy default Prefix is `=` but you can change it accordingly. To get my Commands List type `=help`\n\nIf you want to report any error, you can use the `=report` command and if you want to suggest features for me, you can use the `=suggest` command!")
  .addField("Some Useful Links", "Get my Invite Link [Here](https://discord.com/oauth2/authorize?client_id=733670294086221865&permissions=1584921983&scope=bot)\nNeed Assistnace? Join my [Support Server](https://discord.gg/mqWprFc) Now!")
  .setColor("GREEN")
   defaultChannel.send(embed);
})
client.login(process.env.token)//Enter your bot token here
