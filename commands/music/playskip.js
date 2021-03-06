const play = require("../../utils/play.js")
const { getData, getPreview } = require("spotify-url-info");

module.exports = {
    name: "playskip",
    description: "Skips the current playing song and immediately plays the song provided.",
    args: true,
    usage: "<search query>",
    cooldown: '10',
    async execute(client, message, args) {
        const voiceChannel = message.member.voice.channel;
        if(!voiceChannel) return client.responses("noVoiceChannel", message)

        const permissions = voiceChannel.permissionsFor(client.user);
        if(!permissions.has("CONNECT")) return client.responses("noPermissionConnect", message)
        if(!permissions.has("SPEAK")) return client.responses("noPermissionSpeak", message)

        const player = client.music.players.spawn({
            guild: message.guild,
            textChannel: message.channel,
            voiceChannel: voiceChannel
        });

        if (player.pause == "paused") return message.channel.send(`Cannot play/queue songs while paused. Do \`${client.settings.prefix} resume\` to play.`);

        const msg = await message.channel.send(`${client.emojiList.cd}  Searching for \`${args.join(" ")}\`...`)

        let searchQuery;
        if (args[0].startsWith("https://open.spotify.com")) {
            const data = await getData(args.join(" "));
            console.log(data);
            if (data.type == "playlist" || data.type == "album") {
                return msg.edit(`Cannot playskip a playlist.`)
            } else if (data.type == "track") {
                const track = await getPreview(args.join(" "))
                play(client, message, msg, player, `${track.title} ${track.artist}`, false).then(await playskip());
            }
        } else {
            searchQuery = args.join(" ")
            if (["youtube", "soundcloud", "bandcamp", "mixer", "twitch"].includes(args[0].toLowerCase())) {
                searchQuery = {
                    source: args[0],
                    query: args.slice(1).join(" ")
                }
            }
            play(client, message, msg, player, searchQuery, false).then(await playskip());
        }

        async function playskip(){
            const delay = ms => new Promise(res => setTimeout(res, ms));
            await delay(1500);
            player.queue.splice(1, 0, player.queue[player.queue.size-1])
            await delay(500);
            player.queue.pop();
            player.stop();
        }
    }
}