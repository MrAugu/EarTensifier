const users = require("../../models/user.js");

module.exports = {
    name: "unblock",
    description: "Unblocks a person from using the bot.",
    usage: "<user> <reason>",
    args: true,
    permission: "dev",
    async execute(client, message, args) {
        if (!args[0]) return message.channel.send("Please specifiy a user.")
        const reason = args.slice(1).join(" ");
        if (!reason) return message.channel.send(`Please specify a reason for unblocking this user.`);

        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!user) return message.channel.send("Not a valid user.");

        const msg = await message.channel.send(`${client.emojiList.loading} Unblocking user from bot...`);

        users.findOne({
            authorID: user.id
        }, async (err, u) => {
            if (err) console.log(err);
            if (!u) {
                const newUser = new users({
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
            } else {
                //if (u.blocked == null) u.blocked = false;
                if (u.blocked) {
                    u.blocked = false;
                } else if (!u.blocked) {
                    return msg.edit("That user is already unblocked.");
                }
            }

            const username = await client.users.fetch(u.authorID);
            msg.edit(`Unblocked **${user.user.tag}** from the bot.`)
            //client.channels.get(modlog).send(`${client.emojiList.whitelist} **${message.author.tag}** (${message.author.id}) unblocked **${user.user.tag}** (${user.id}). Reason: ${reason}`);
            await u.save().catch(e => console.log(e));
        });
    },
};