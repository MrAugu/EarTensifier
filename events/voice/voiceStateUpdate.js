const Event = require('../../structures/Event');

module.exports = class VoiceStateUpdate extends Event {
    constructor(...args) {
        super(...args)
    }

    async run(oldVoice, newVoice) {
        if(oldVoice.guild.me.voice.channel == null) return;
        const player = this.client.music.players.get(oldVoice.guild.id);
        if (!player) return;

        if (oldVoice.id === this.client.user.id) return;
        if (oldVoice.guild.members.cache.get(this.client.user.id).voice.channel.id === oldVoice.channelID) {
            if (oldVoice.guild.voice.channel && oldVoice.guild.voice.channel.members.size === 1) {
                let msg = await player.textChannel.send(`Leaving ${this.client.emojiList.voice}**${oldVoice.guild.members.cache.get(this.client.user.id).voice.channel.name}** in ${this.client.settings.voiceLeave/1000} seconds because I was left alone.`)
                const delay = ms => new Promise(res => setTimeout(res, ms));
                await delay(this.client.settings.voiceLeave);
                if((oldVoice.guild.members.cache.get(this.client.user.id).voice.channel.members.size - 1) > 0) return msg.delete();
                this.client.music.players.destroy(oldVoice.guild.id);
                msg.edit(`I left ${this.client.emojiList.voice}**${oldVoice.guild.members.cache.get(this.client.user.id).voice.channel.name}** because I was left alone.`)
            }
        }
    };
}