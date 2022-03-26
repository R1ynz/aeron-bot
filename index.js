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


aeron.ev.on('connection.update', async (update) => {

        const { connection, lastDisconnect } = update;
        if (connection === 'connecting') {
            console.log("connecting....")
        } else if (connection === 'close') 
        statusCode = lastDisconnect.error ? new Boom(lastDisconnect)?.output.statusCode : 0;

            console.log(lastDisconnect.error);
            if (statusCode === DisconnectReason.badSession) { log(`Bad session file, delete ${session} and run again`); startAeron(); }
            else if (statusCode === DisconnectReason.connectionClosed) { log('Connection closed, reconnecting....'); startAeron() }
            else if (statusCode === DisconnectReason.connectionLost) { log('Connection lost, reconnecting....'); startAeron() }
            else if (statusCode === DisconnectReason.connectionReplaced) { log('Connection Replaced, Another New Session Opened, Please Close Current Session First'); process.exit() }
            else if (statusCode === DisconnectReason.loggedOut) { log(`Device Logged Out, Please Delete ${session} and Scan Again.`); process.exit(); }
            else if (statusCode === DisconnectReason.restartRequired) { log('Restart required, restarting...'); startAeron(); }
            else if (statusCode === DisconnectReason.timedOut) { log('Connection timedOut, reconnecting...'); startAeron(); }
            else {
                console.log(lastDisconnect.error); startAeron()
            }
        } else if (connection === 'open') {
          console.log("konek")
        }
    });


aeron.ev.on('creds.update', saveState);
};



startAeron();

