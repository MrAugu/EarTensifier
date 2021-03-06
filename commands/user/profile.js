const Discord = require("discord.js");
const users = require("../../models/user.js");

module.exports = {
  name: "profile",
  description: "Displays the user's profile",
  usage: "<user>",
  async execute (client, message, args) {
    const msg = await message.channel.send(`${client.emojiList.loading} Fetching profile...`);

    const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    if (!user) return msg.edit(replies.noUser);

    users.findOne({
      authorID: user.id
    }, async (err, u) => {
      if (err) console.log(err);
      let ranks = "";
      if (!u) {
        const newUser = new profiles({
            authorID: user.id,
            authorName: user.tag,
            bio: "",
            songsPlayed: 0,
            commandsUsed: 0,
            blocked: false,
            premium: false,
            pro: false,
            developer: false,
        });
        newUser.save().catch(e => console.log(e));
        const embed = new Discord.MessageEmbed()
          .setThumbnail(user.user.displayAvatarURL())
          .addField("User", `${user.user.tag}`, true)
          .addField("Bio", "No bio set")
          .setColor(client.colors.main)
          .setFooter(`Commands Used: ${u.commandsUsed} | Songs Played: ${u.songsPlayed}`)
          .setTimestamp();
        return msg.edit("", embed);
      } else {

        if (u.voted) ranks += " " + client.emojiList.voted;
        if (u.premium) ranks += " " + client.emojiList.supporter;
        if (u.developer) ranks += " " + client.emojiList.developer;

        let bio;
        if(!u.bio) bio = "No bio set";
        else bio = u.bio;

        const embed = new Discord.MessageEmbed()
          .setThumbnail(user.user.displayAvatarURL())
          .addField("User", `${user.user.tag}${ranks}`, true)
          .addField("Bio", `${bio}`)
          .setColor(client.colors.main)
          .setFooter(`Commands Used: ${u.commandsUsed} | Songs Played: ${u.songsPlayed}`)
          .setTimestamp();
        return msg.edit("", embed);
      }
    });
  },
};