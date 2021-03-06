const Discord = require("discord.js");
const Event = require('../../structures/Event');
const patreonData = require("../../resources/patreon.json");
const webhooks = require("../../resources/webhooks.json");
const patreon = require('../../utils/premium/patreon.js');

const webhookClient = new Discord.WebhookClient(webhooks.patreonWebhookID, webhooks.patreonWebhookToken);

module.exports = class GuildMemberUpdate extends Event {
    constructor(...args) {
        super(...args)
    }

    async run(oldMember, newMember) {
        if (oldMember.guild.id != this.client.settings.supportID) return;

        if (oldMember.roles !== newMember.roles) {

            if (oldMember.roles.cache.find(r => r.name === "Premium") && !newMember.roles.cache.find(r => r.name === "Premium")) {
                const embed = new Discord.MessageEmbed()
                    .setAuthor("Deleted Patreon", "https://cdn.discordapp.com/avatars/216303189073461248/00a6db63b09480d1613877bf40e98bea.webp?size=2048")
                    .setColor(this.client.colors.offline)
                    .setThumbnail(newMember.user.avatarURL())
                    .setDescription(`**${newMember.user.tag}** (${newMember.user.id}) is no longer a Patreon supporter.`)
                    .setTimestamp()

                webhookClient.send({
                    username: 'Ear Tensifier',
                    avatarURL: this.client.settings.avatar,
                    embeds: [embed],
                });

                return patreon(newMember.user, "Remove")
            } //else if (oldMember.roles.cache.find(r => r.name === "Premium")) return;

            if (!newMember.roles.cache.find(r => r.name === "Premium") && !newMember.roles.cache.find(r => r.name === "Pro")) return;

            const embed = new Discord.MessageEmbed()
                .setAuthor("New Patreon!", "https://cdn.discordapp.com/avatars/216303189073461248/00a6db63b09480d1613877bf40e98bea.webp?size=2048")
                .setColor(this.client.colors.online)
                .setThumbnail(newMember.user.avatarURL())
                .setDescription(`**${newMember.user.tag}** (${newMember.user.id}) is now a Patreon supporter!`)
                .setTimestamp()

              if (newMember.roles.cache.find(r => r.name === "Pro")) {
                embed.addField("Tier", "Pro", true)
                embed.addField("Pledge", patreonData.proPrice, true)

                patreon(newMember.user, "Pro");

            } else if (newMember.roles.cache.find(r => r.name === "Premium")) {
                embed.addField("Tier", "Premium", true)
                embed.addField("Pledge", patreonData.premiumPrice, true)

                patreon(newMember.user, "Premium");
            }

            webhookClient.send({
                username: 'Ear Tensifier',
                avatarURL: this.client.settings.avatar,
                embeds: [embed],
            });
        }
    }
}