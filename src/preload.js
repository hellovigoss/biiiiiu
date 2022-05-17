const { contextBridge, ipcRenderer, clipboard } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    // message sender and receiver
    send: (msg, cb) => {
        ipcRenderer.send('send', msg)
        ipcRenderer.on('reply', (event, arg) => {
            cb(arg)
        })
    },
    capture: (sourceId, videoDom, cb) => {
        navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
                mandatory: {
                    chromeMediaSource: 'desktop',
                    chromeMediaSourceId: sourceId,
                    minWidth: 2048,
                    maxWidth: 2048,
                    minHeight: 1024,
                    maxHeight: 1024
                }
            }
        }).then(
            stream => {
                console.log(stream, videoDom)
                videoDom.srcObject = stream
                videoDom.play()
                cb()
            }
        ).catch(err => { console.error(err) })
    },
    copy: (text) => {
        clipboard.writeText(text)
    }
})


