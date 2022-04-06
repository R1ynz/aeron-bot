const { downloadContentFromMessage } = require('@adiwajshing/baileys');
const fetchh = require('node-fetch')
const { writeFile } = require('fs/promises')

exports.fetch = fetch = (url) => new Promise(async (resolve, reject) => {
    fetchh(url)
        .then(response => response.json())
        .then(res => {
             resolve(res)
         })
         .catch((err) => {
             reject(err)
         })
 })
exports.downloadSaveImgMsg = downloadSaveImgMsg = (pesan, namafile) => new Promise(async (resolve, reject) => {
const dunlud = await downloadContentFromMessage(pesan, 'image')
let buffer = Buffer.from([])
for await(const chunk of dunlud) {
buffer = Buffer.concat([buffer, chunk])
}
writeFile(namafile, buffer)
})
})