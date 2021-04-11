const { ipcRenderer } = require('electron')

window.addEventListener('DOMContentLoaded', async () => {
    document.getElementById('playButton').addEventListener('click', () => {
        document.getElementById('playButton').innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Launching GD...'
        document.getElementById('playButton').disabled = true
        ipcRenderer.send('launchGame', [])
    })
})

ipcRenderer.on('cleanup', (event, args) => {
    document.getElementById('playButton').innerHTML = '<i class="bi bi-play-circle-fill"></i> Launch GD'
    document.getElementById('playButton').disabled = false
})