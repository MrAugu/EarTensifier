module.exports = {
    name: "shuffle",
    description: "Shuffles the queue.",
    aliases: ["mix"],
    cooldown: 10,
    async execute(client, message, args) {
        const voiceChannel = message.member.voice.channel;
        const player = client.music.players.get(message.guild.id);

        if(!voiceChannel) return client.responses('noVoiceChannel', message);
        if(voiceChannel.id != message.guild.members.cache.get(client.user.id).voice.channel.id) return client.responses('sameVoiceChannel', message);

        if(!player) return client.responses('noSongsPlaying', message)

        player.queue.shuffle();
        return message.channel.send("Shuffled the queue...")
    }
}