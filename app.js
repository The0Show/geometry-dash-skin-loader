const electron = require('electron')
const fs = require('fs')
let isDev = require('isdev')
const exec = require('child_process').exec

async function isRunning(win, mac, linux){
    return new Promise(function(resolve, reject){
        const plat = process.platform
        const cmd = plat == 'win32' ? 'tasklist' : (plat == 'darwin' ? 'ps -ax | grep ' + mac : (plat == 'linux' ? 'ps -A' : ''))
        const proc = plat == 'win32' ? win : (plat == 'darwin' ? mac : (plat == 'linux' ? linux : ''))
        if(cmd === '' || proc === ''){
            resolve(false)
        }
        exec(cmd, function(err, stdout, stderr) {
            resolve(stdout.toLowerCase().indexOf(proc.toLowerCase()) > -1)
        })
    })
}


function showNotification(title, body) {
    const notification = {
      title: title,
      body: body,
    }
    new Notification(notification).show()
}

const { app, BrowserWindow, Menu, dialog, ipcMain, shell, Notification } = electron

//const icon = require('./')
const srcdir = `${__dirname}/src`

let mainWindow

app.on('ready', function(){
    mainWindow = new BrowserWindow({
        titleBarStyle: 'hidden',
        center: true,
        webPreferences: {
            preload: `${srcdir}/js/index.js`
        },
        //icon: icon
    })

    const developmentMenu = Menu.buildFromTemplate([
        {
            "label": "Development",
            "submenu": [
                { role: 'reload' },
                { role: 'forceReload' },
                { role: 'toggleDevTools' },
                { type: 'separator' },
                { role: 'resetZoom' },
                { role: 'zoomIn' },
                { role: 'zoomOut' },
                { type: 'separator' },
                { role: 'togglefullscreen' }
            ]
        }
    ])

    if(isDev){
        Menu.setApplicationMenu(developmentMenu)
    } else {
        Menu.setApplicationMenu(null)
    }
    mainWindow.setTitle('Geometry Dash Skin Loader')
    mainWindow.loadFile(`${srcdir}/html/index.html`)
})

ipcMain.on('launchGame', async (event, arg) => {
    shell.openExternal('steam://rungameid/322170')

    const isRunningLoop = setInterval(async () => {
        await isRunning('GeometryDash.exe', 'GeometryDash', 'GeometryDash').then((v) => {
            if(!v){
                mainWindow.webContents.send('cleanup', [])
                shell.openExternal('steam://validate/322170')
                showNotification('Geometry Dash Skin Loader', 'We\'re reverting your game files, soon they\'ll be back to normal :)')
                
                clearInterval(isRunningLoop)
            }
        })
    }, 10000);
})
