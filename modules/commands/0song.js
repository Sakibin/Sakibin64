const axios = require('axios');
const fs = require('fs');

module.exports.config = {
    name: "sing",
    version: "1.0.0",
    hasPermision: 0,
    credits: "sakibin", 
    description: "Search and play music from Spotify",
    commandCategory: "spotify",
    usage: "[song name]",
    cooldowns: 5,
    usages: "[song name]",
    cooldown: 5,  
};

module.exports.run = async function ({ api, event, args }) {
    const listensearch = encodeURIComponent(args.join(" "));
    const apiUrl = `https://api.elianabot.xyz/tools/ytmp3.php?music=${listensearch}`;

    if (!listensearch) return api.sendMessage("Please provide the name of the song you want to search.", event.threadID, event.messageID);

    try {
        // Set 🔍 reaction when download starts
        api.setMessageReaction("🔍", event.messageID, (err) => {}, true);

        const response = await axios.get(apiUrl);
        const { music_data: { link, title }, video_title } = response.data;

        if (link) {
            const filePath = `${__dirname}/cache/${event.senderID}.mp3`;
            const writeStream = fs.createWriteStream(filePath);

            const audioResponse = await axios.get(link, { responseType: 'stream' });

            audioResponse.data.pipe(writeStream);

            writeStream.on('finish', () => {
                api.sendMessage({
                    body: `🎵 | New YTDL api.\n\n🎶 Music: ${title || video_title}\n`,
                    attachment: fs.createReadStream(filePath),
                }, event.threadID, () => fs.unlinkSync(filePath), event.messageID);
                
                // Set ✅ reaction when download is done
                api.setMessageReaction("✅", event.messageID, (err) => {}, true);
            });
        } else {
            api.sendMessage("❓ | Sorry, couldn't find the requested music on Spotify.", event.threadID);
        }
    } catch (error) {
        console.error(error);
        api.sendMessage("🚧 | An error occurred while processing your request.", event.threadID);
    }
};
