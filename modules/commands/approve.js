module.exports.config = {
  name: "approve",
  version: "1.0.2",
  hasPermssion: 1,
  credits: "MR CHAND",
  description: "approve list/del/pending",
  commandCategory: "Box",
  cooldowns: 5
};


const dataPath = __dirname + "/cache/approvedThreads.json";
const pendingPath = __dirname + "/cache/pendingThreads.json";
const fs = require("fs");

module.exports.onLoad = () => {
  if (!fs.existsSync(dataPath)) fs.writeFileSync(dataPath, JSON.stringify([]));
  if (!fs.existsSync(pendingPath)) fs.writeFileSync(pendingPath, JSON.stringify([]));
}

module.exports.run = async ({ event, api, args }) => {
  const { threadID, messageID, senderID } = event;
  let data = JSON.parse(fs.readFileSync(dataPath));
  let pending = JSON.parse(fs.readFileSync(pendingPath));
  let msg = "";
  let idBox = (args[0]) ? args[0] : threadID;
  if (args[0] == "list") {
    msg = "LIST OF APPROVED BOXES! ";
    let count = 0;
    for (e of data) {
      msg += `\n${count += 1}. ID: ${e}`;
    }
    api.sendMessage(msg, threadID, messageID);
  }
  else if (args[0] == "del") {
    idBox = (args[1]) ? args[1] : event.threadID;
    if (isNaN(parseInt(idBox))) return api.sendMessage("Not a number.", threadID, messageID);
    if (!data.includes(idBox)) return api.sendMessage("⚠️ | Need Permission! Inbox Admin for Approval.\n⭓ Messanger:\nhttps://m.me/imsakibin007\n[Prefix]request", threadID, messageID);
    api.sendMessage(`⚠️ | Box ${idBox} has been removed from bot permission list and needs admin approval again...⛔`, threadID, () => {
      if (!pending.includes(idBox)) pending.push(idBox);
      data.splice(data.indexOf(idBox), 1);
      fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
      fs.writeFileSync(pendingPath, JSON.stringify(pending, null, 2));
    }, messageID)
  }
  else if (args[0] == "pending") {
    msg = "LIST OF BOXES WAITING FOR APPROVAL!";
    let count = 0;
    for (e of pending) {
      let name = (await api.getThreadInfo(e)).name || "Group Chat";
      msg += `\n${count += 1}. ${name}\nID: ${e}`;
    }
    api.sendMessage(msg, threadID, messageID);
  }
  else if (isNaN(parseInt(idBox))) api.sendMessage("Id you entered is invalid ", threadID, messageID);
  else if (data.includes(idBox)) api.sendMessage(`Thread Box ID ${idBox} has been approved in advance! `, threadID, messageID);
  else api.sendMessage(`» 𝗕𝗢𝗧 𝗖𝗢𝗡𝗡𝗘𝗖𝗧𝗘𝗗 》─────⊷\n╭───────✧❁✧───────«\n│✅ Loaded All commands.\n💫 Don't Spam with BOT.\n👤 Owner: https://m.facebook.com/imsakibin007\n💌 Inbox: https://m.me/imsakibin007\n\n╰───────✧❁✧───────»\n╰───────────────⊷☑`, idBox, (error, info) => {
    if (error) return api.sendMessage("An error has occurred, making sure that the ID you entered is valid and the bot is in the box! ", threadID, messageID);
    else {
      data.push(idBox);
      pending.splice(pending.indexOf(idBox), 1);
      fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
      fs.writeFileSync(pendingPath, JSON.stringify(pending, null, 2));
      api.sendMessage(`» ✅ | Successfully Approved\n🎁 | Box: ${idBox}\n\n✨ | Enjoy....`, threadID, messageID);
    }
  });
  }