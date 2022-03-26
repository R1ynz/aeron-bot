const { default: makeWASocket, Browsers, AnyMessageContent, delay, proto, generateWAMessageFromContent, DisconnectReason, fetchLatestBaileysVersion, useSingleFileAuthState } = require('@adiwajshing/baileys');
const fs = require('fs');
const P = require ('pino');
const { exec } = require("child_process")
const { Boom } = require('@hapi/boom')
const chalkanim = require('chalk-animation');
const package = require('./package.json');
const CFonts = require('cfonts');
const { state, saveState } = useSingleFileAuthState('./session.json');


const startAeron = async() => {
const { version, isLatest } = await fetchLatestBaileysVersion();

CFonts.say(`${package.name.split('-')[0]}|Bot`, {
font: 'simpleBlock',
align: 'center',
colors: ['greenBright'],
background: 'transparent',
letterSpacing: 1,
space: true,
});
CFonts.say(`${package.version}`, {
font: 'console',
align: 'center',
colors: ['greenBright'],
background: 'transparent',
letterSpacing: 1,
space: true,
});

const aeron = makeWASocket({ version, logger: P({ level: 'silent' }), printQRInTerminal: true, auth: state, browser: ['R1ynz', 'Chrome', '3.0.0'] });

aeron.ev.on('messages.upsert', async ({ messages }) => {
const msg = messages[0];
if (msg.fromMe) return;
require('./aeron')(aeron, msg);
});

aeron.ev.on('group-participants.update', async (apdet) =>{
console.log(apdet)
})


aeron.ev.on('connection.update', (update) => {
const { connection, lastDisconnect } = update
if (connection === 'close') {
const error = (lastDisconnect.error)?.output.payload.message
if (error ==='Connection Failure') { 
console.log("Gagal menghubungkan ke session, Ketik node index.js untuk memulai ulang") 
exec('rm -rf session.json') 
}
} else if  (connection === 'open') {
console.log("connected")
}

})


aeron.ev.on('creds.update', saveState);
};



startAeron();

