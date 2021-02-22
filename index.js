const { ifError } = require("assert");
const Discord = require("discord.js");
var fs = require("fs");
const config = require("./botconfig.json");

const client = new Discord.Client();

client.commands = new Discord.Collection();

fs.readdir("./commands/", (err, files) =>{
    if(err) console.log(err);

    let jsfile = files.filter(f => f.split(".").pop() === "js");

    if(jsfile.length <= 0){
        console.log("Wystapił błąd bota! Folder ./commands/ jets pusty!");

    }

    jsfile.forEach((f) =>{
        let props = require(`./commands/${f}`)
        client.commands.set(props.help.name,props)
    })
})

client.on("ready",() => {
    console.log("Bot is ready!");
    client.user.setActivity("GRAFIKOLANDIE",{type: "WATCHING"});
})
client.on("message", async message =>{


    let nocmd = new Discord.MessageEmbed()
.setTitle("Nie ma takiej komendy! <a:dennied:811541533178069012>")
.setDescription("Nie ma takiej komendy spróbuj ponownie! Liste komend masz pod komendą **,help**!")
.setColor("#A968E9")
.setFooter(`GrafikBot`)
.setTimestamp();


    if(message.content === "ping")return message.channel.send("Pong!");

    let prefix = config.prefix;
    if(!message.content.startsWith(prefix)) return;

    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);
    let commandfile = client.commands.get(cmd.slice(prefix.length));
    if(commandfile) commandfile.run(client,message,args);
    if(!commandfile) return message.channel.send(nocmd)
});


client.login(config.token);