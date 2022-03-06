const respon = require('./lib/respon.js');
const { generateWAMessageFromContent, proto } = require('@adiwajshing/baileys');
var colors = require('colors/safe');
const fs = require('fs');
const chalkanim = require('chalk-animation');
const moment = require("moment-timezone");
const { fetch } = require('./lib/anu.js');
const session = require('./session.json');
moment.tz.setDefault('Asia/Jakarta').locale("id");


const list = "│▷";


module.exports = hehe = async (aeron, msg) => {
try {
const type = Object.keys(msg.message)[0];
const body = (type === 'conversation') ? msg.message.conversation : (type == 'imageMessage') ? msg.message.imageMessage.caption : (type == 'videoMessage') ? msg.message.videoMessage.caption : (type == 'extendedTextMessage') ? msg.message.extendedTextMessage.text : (type == 'buttonsResponseMessage') ? msg.message.buttonsResponseMessage.selectedButtonId : (type == 'listResponseMessage') ? msg.message.listResponseMessage.singleSelectReply.selectedRowId : (type == 'templateButtonReplyMessage') ? msg.message.templateButtonReplyMessage.selectedId : (type === 'messageContextInfo') ? (msg.message.buttonsResponseMessage?.selectedButtonId || msg.message.listResponseMessage?.singleSelectReply.selectedRowId || msg.text) : ''
const prefix = /^[./~!#%^&=\,;:()z]/.test(body) ? body.match(/^[./~!#%^&=\,;:()z]/gi) : '#';
const isCommand = body.startsWith(prefix);
const cmd = isCommand ? body.slice(1).trim().split(/ +/).shift().toLowerCase() : null;
const time = moment(new Date()).format("HH:mm");
const text = msg.message.conversation;
const isGroup = msg.key.remoteJid.endsWith('@g.us');
const from = msg.key.remoteJid;
const content = JSON.stringify(msg.message);
const args = body.trim().split(/ +/).slice(1);
const q = args.join(" ");
const botNumber = aeron.user.id.split(':')[0] + '@s.whatsapp.net';
const botName = aeron.user.name;
const pushname = msg.pushName;
const sender = isGroup ? (msg.key.participant ? msg.key.participant : msg.participant) : msg.key.remoteJid;
const groupMetadata = isGroup ? await aeron.groupMetadata(from) : '';
const uwong = isGroup ? await groupMetadata.participants : '';
const groupAdmins = isGroup ? await uwong.filter(v => v.admin !== null).map(a => a.id) : '';
const isBotGroupAdmins = groupAdmins.includes(botNumber) || false;
const isGroupAdmins = groupAdmins.includes(sender) || false;
const groupName = isGroup ? groupMetadata.subject : "";

const isMedia = (type === 'imageMessage' || type === 'videoMessage');
const isQuotedImage = type === 'extendedTextMessage' && content.includes('imageMessage');
const isQuotedVideo = type === 'extendedTextMessage' && content.includes('videoMessage');
const isQuotedSticker = type === 'extendedTextMessage' && content.includes('stickerMessage');

await aeron.sendReadReceipt(from, msg.key.participant, [msg.key.id]);



if (isGroup && isCommand) {
console.log(colors.green.bold("[Group]") + " " + colors.brightCyan(time,) + " " + colors.black.bgYellow(args[0]) + " " + colors.green("from") + " " + colors.blue(groupName));
} else if (!isGroup && isCommand) {
console.log(colors.green.bold("[Private]") + " " + colors.brightCyan(time,) + " " + colors.black.bgYellow(args[0]) + " " + colors.green("from") + " " + colors.blue(pushname));
}

const reply = (teksnya) => {
		aeron.sendMessage(from, { text: teksnya },{ quoted: msg});
};
const sendVideo = () => {
};


switch (cmd) {
case 'ytmp3':
if (!q) return reply('masukan link video youtube yang ingin di download\n_ex: !ytmp3 https://youtube.com');
const url = await fetch(`https://rydev-api.herokuapp.com/docs/ytaudio?url=${q}`);
console.log(url);
aeron.sendMessage(from, { audio: { url: url.result.dl_link }, mimetype: 'audio/mpeg' }, { quoted: msg });
break
case 'promote':
if (!isGroup) return reply(respon.onlyGroup(pushname));
if (!isGroupAdmins) return reply(respon.onlyAdmin(pushname));
if (!isBotGroupAdmins) return reply(respon.botAdmin(pushname));
if (msg.message.extendedTextMessage === undefined || msg.message.extendedTextMessage === null) return reply('Tag orang yang ingin dipromosikan menjadi admin group');
const men = msg.message.extendedTextMessage.contextInfo.mentionedJid;
aeron.groupParticipantsUpdate(from, men,"promote");
break
case 'demote':
if (!isGroup) return reply(respon.onlyGroup(pushname));
if (!isGroupAdmins) return reply(respon.onlyAdmin(pushname));
if (!isBotGroupAdmins) return reply(respon.botAdmin(pushname));
if (msg.message.extendedTextMessage === undefined || msg.message.extendedTextMessage === null) return reply('Tag orang yang ingin di demote di group ini');
const mention = msg.message.extendedTextMessage.contextInfo.mentionedJid;
await aeron.groupParticipantsUpdate(from, mention,"demote");
break
case 'add':
try {
if (!isGroup) return reply(respon.onlyGroup(pushname));
if (!isGroupAdmins) return reply(respon.onlyAdmin(pushname));
if (!isBotGroupAdmins) return reply(respon.botAdmin(pushname));
if (!q) return reply("Masukan nomor yang ingin ditambahkan di group\nex: !add 62881xxxxxxx")
nomor = `${args[0].replace(/ /g, '')}@s.whatsapp.net`
await aeron.groupParticipantsUpdate(from, [nomor],"add")
} catch (e) {
reply('Maaf error')
}
break
case 'kick':
try {
if (!isGroup) return reply(respon.onlyGroup(pushname));
if (!isGroupAdmins) return reply(respon.onlyAdmin(pushname));
if (!isBotGroupAdmins) return reply(respon.botAdmin(pushname));
if (msg.message.extendedTextMessage === undefined || msg.message.extendedTextMessage === null) return reply('Tag orang yang ingin dikeluarkan dari group ini')
const mention = msg.message.extendedTextMessage.contextInfo.mentionedJid
await aeron.groupParticipantsUpdate(from, mention,"remove")
} catch (e) {
reply('Maaf error')
}
break

case 'resetlink':
case 'revoke':
if (!isGroup) return reply(respon.onlyGroup(pushname));
if (!isGroupAdmins) return reply(respon.onlyAdmin(pushname));
if (!isBotGroupAdmins) return reply(respon.botAdmin(pushname));
await aeron.groupRevokeInvite(from)
break
case 'linkgroup':
if (!isGroup) return reply(respon.onlyGroup(pushname));
if (!isGroupAdmins) return reply(respon.onlyAdmin(pushname));
if (!isBotGroupAdmins) return reply(respon.botAdmin(pushname));
const code = await aeron.groupInviteCode(from)
reply("https://chat.whatsapp.com/" + code)
break
case 'setdesc':
if (!isGroup) return reply(respon.onlyGroup(pushname));
if (!isGroupAdmins) return reply(respon.onlyAdmin(pushname));
if (!isBotGroupAdmins) return reply(respon.botAdmin(pushname));
if (!q) return reply(respon.notText(prefix,cmd, pushname));
sock.groupUpdateDescription(from, q)
break
case 'setname':
if (!isGroup) return reply(respon.onlyGroup(pushname));
if (!isGroupAdmins) return reply(respon.onlyAdmin(pushname));
if (!isBotGroupAdmins) return reply(respon.botAdmin(pushname));
if (!q) return reply(respon.notText(prefix,cmd, pushname));
aeron.groupUpdateSubject(from, q);
break
case 'owner':
const vcard = 'BEGIN:VCARD\n' // metadata of the contact card
+ 'VERSION:3.0\n' 
+ 'FN:kamu awikwok banget banh\n' // full name
+ 'ORG:Bocah gajelas;\n' // the organization of the contact
+ 'TEL;type=CELL;type=VOICE;waid=6285648294105:+62 856 4829 4105\n' // WhatsApp ID + phone number
+ 'END:VCARD';
const sentMsg  = await aeron.sendMessage(from, { contacts: { contacts: [{ vcard }] }});
break
case 'donasi':
case 'donate':
const donasi =`┌──「 *Pulsa* 」\n${list} 0856-4829-4105\n└────`
reply(donasi)
break
case 'help':
case 'menu':
const menu = `┌──「 *Group Menu* 」
${list} ${prefix}add
${list} ${prefix}kick
${list} ${prefix}promote
${list} ${prefix}demote
${list} ${prefix}resetlink
${list} ${prefix}linkgroup
${list} ${prefix}setname
${list} ${prefix}setdesc
└────
`
const template = generateWAMessageFromContent(from, proto.Message.fromObject({
templateMessage: {
hydratedTemplate: {
hydratedContentText: menu,
locationMessage: { 
jpegThumbnail: fs.readFileSync('./thumbnail/menu.jpg') },
hydratedFooterText: "Bot whatsapp multi device",
hydratedButtons: [{
urlButton: {
displayText: 'Script bot',
url: 'https://github.com/R1ynz/aeron-bot'
}
}, 
{
quickReplyButton: {
displayText: 'Donasi',
id: '.donasi',
}
},
{
quickReplyButton: {
displayText: 'Owner',
id: '.owner',
}
}]
}
}
}), { userJid: msg.sender, quoted: msg });
await aeron.relayMessage(from, template.message, { messageId: template.key.id })
break

default: 
}
} catch (e) {
console.log(`${e}`) 
}
}
