const { default: makeWASocket, AnyMessageContent, delay, proto, generateWAMessageFromContent, DisconnectReason, fetchLatestBaileysVersion, useSingleFileAuthState } = require('@adiwajshing/baileys');
const fs = require('fs');
const P = require ('pino');
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

const aeron = makeWASocket({ version, logger: P({ level: 'silent' }), printQRInTerminal: true, auth: state });

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
        if(connection === 'close') {
            const shouldReconnect = lastDisconnect.error ? new Boom(lastDisconnect)?.output.statusCode : 0;
            console.log('connection closed due to ', lastDisconnect.error, ', reconnecting ', shouldReconnect)
            if(shouldReconnect) {
                startAeron()
            }
        } else if(connection === 'open') {
            console.log('opened connection')
        }
    })


aeron.ev.on('creds.update', saveState);
};



startAeron();

