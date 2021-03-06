module.exports = {
    name: "stop",
    description: "Stops the queue.",
    cooldown: "10",
    async execute(client, message, args) {
        const voiceChannel = message.member.voice.channel;
        const player = client.music.players.get(message.guild.id);

        if(!voiceChannel) return client.responses('noVoiceChannel', message);
        if(voiceChannel.id != message.guild.members.cache.get(client.user.id).voice.channel.id) return client.responses('sameVoiceChannel', message);

        if(player) client.music.players.destroy(message.guild.id);
        else message.member.voice.channel.leave();
        return message.channel.send(`Stopped the queue.`)
    }
}