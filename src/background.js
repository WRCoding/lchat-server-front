import {app, BrowserWindow, dialog, ipcMain, Menu, protocol} from 'electron'
import net from 'net'
import path from 'path'
import {sqliteDB} from './js/db'
import installExtension, {VUEJS_DEVTOOLS} from 'electron-devtools-installer'
import image from "./js/image";
import sql from "./js/sql"

const nativeImage = require('electron').nativeImage
const isDevelopment = process.env.NODE_ENV !== 'production'
// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
    {scheme: 'app', privileges: {secure: true, standard: true}}
])


let win;
let socket = null;

let db = null

function createConnect(message) {
    socket = net.createConnection({
        host: '127.0.0.1',
        port: 7778
    });
    socket.on('connect', () => {
        // 向服务器发送数据
        writeToServer(message)
    })
    socket.on('data', buffer => {
        console.log(socket.localAddress + ' : ' + socket.localPort + ' -> ' + buffer.toString());
        win.webContents.send('receive', buffer.toString())
    });

    socket.on('end', () => {
        socket = null
        console.log('disconnected from server');
    })
}

function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({
        width: 500,
        height: 300,
        title: 'L-Chat',
        icon: 'src/assets/chat.png',
        maxHeight: 300,
        maxWidth: 500,
        center: true,
        webPreferences: {

            // Use pluginOptions.nodeIntegration, leave this alone
            // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
            nodeIntegration: true,
            contextIsolation: false
        }
    })
    Menu.setApplicationMenu(null)
    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the dev server if in development mode
        win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
        if (!process.env.IS_TEST) win.webContents.openDevTools()
    } else {
        // createProtocol('app')
        // Load the index.html when not in development
        // win.loadURL('app://./index.html')
    }
}

ipcMain.on('openDialog', (event, arg) => {
    dialog.showOpenDialog(win, {
        properties: ['openFile']
    }).then(result => {
        console.log(result.canceled)
        console.log(result.filePaths)
    }).catch(err => {
        console.log(err)
    })
})
ipcMain.on('login', (event, arg) => {
    let array = arg.split('*')
    createConnect(array[1].toString())
    db = new sqliteDB(array[0] + '.db');
    // win.setPosition(10,10)
    win.setMaximumSize(1250, 735)
    win.setSize(1280, 735)
    win.center()
    win.webContents.send('success', 'client')
})
ipcMain.on('updateFriend', (event, arg) => {
    let deleteSql = 'delete from lchat_friend'
    db.executeSql(deleteSql)
    let insertSql = 'insert into lchat_friend values (?,?,?,?,?)'
    db.insertDataBatch(insertSql, arg)
})
ipcMain.on('queryFriend', () => {
    let querySql = 'select * from lchat_friend'
    db.queryData(querySql, ((data) => {
        win.webContents.send('friendsInfo', data)
    }))
})
ipcMain.on('querySingleChats', (event, arg) => {
    let querySql = `
      SELECT
        * 
      FROM
        lchat_message 
        WHERE
        ("from" = '?' and "to" = '#') 
        OR ("from" = '#' and "to" = '?')  
        ORDER BY
        msgSeq ASC
  `
    querySql = querySql.replaceAll('?', arg[0])
    querySql = querySql.replaceAll('#', arg[1])
    db.queryData(querySql, ((data) => {
        win.webContents.send('chats', data)
    }))
})

ipcMain.on('queryGroupChats',((event, args) => {
    let query_sql = sql.groupMessageSql(args)
    console.log(query_sql)
    db.queryData(query_sql, ((data) => {
        event.returnValue = data
    }))
}))

ipcMain.on('logout', (event, arg) => {
    win.setMaximumSize(500, 300)
    win.setSize(500, 300)
    win.center()
    const data = {'msgSeq': new Date().getTime(), 'from': arg, 'to': 'server', 'type': 'QUIT'};
    socket.end(JSON.stringify(data) + '\n')
    event.sender.send('successLogout', 'to index')
})
ipcMain.on('sendMsg', (event, arg) => {
    writeToServer(arg.toString())
})
ipcMain.handle('updateGroup',((event, args) => {
    let deleteSql = 'delete from lchat_group_info'
    db.executeSql(deleteSql)
    deleteSql = 'delete from lchat_group_member'
    db.executeSql(deleteSql)
    let groupSql = 'insert into lchat_group_info values (?,?,?,?)'
    let memberSql = 'insert into lchat_group_member values (?,?,?,?)'
    db.insertDataBatch(groupSql, args[0])
    db.insertDataBatch(memberSql, args[1])
    return 1
}))

ipcMain.on('queryGroupMembers',(((event, args) => {
    let sql = `select group_member_lcid as lcid,username,avatar from lchat_group_member where group_id = '`+args.toString()+ `'`
    db.queryData(sql,((data) => {
        event.returnValue = data
    }))
})))

ipcMain.handle('downLoadOss', async (event, arg) => {
    let data = await downLoadOss(arg)
    return data
})
//.then((data) => {
//     if (data.res.status === 200){
//       let msgArray = message.split('-')
//       let size = {width: msgArray[3],height: msgArray[4]}
//       let name = message.split('/')[1]
//       let localFilePath = process.cwd()+'\\receiveImage\\'+name
//       console.log('localFilePath: ',localFilePath)
//       let image = nativeImage.createFromPath(localFilePath)
//       let dataUrl = image.toDataURL()
//       // if (arg[0] === 1){
//       //   win.webContents.send('dataUrl',parseData)
//       // }else{
//       //   win.webContents.send('OffLineDataUrl',parseData)
//       // }
//       return callback(size.width + '_' + size.height + '_' + dataUrl)
//     }
//   })
async function dowLoadImage(message) {
    let data = await image.downloadImage(message)
    if (data.res.status === 200) {
        let msgArray = message.split('-')
        let size = {width: msgArray[3], height: msgArray[4]}
        let name = message.split('/')[1]
        let localFilePath = process.cwd() + path.sep  + 'receiveImage' + path.sep + name
        console.log('localFilePath: ', localFilePath)
        let image = nativeImage.createFromPath(localFilePath)
        let dataUrl = image.toDataURL()
        // if (arg[0] === 1){
        //   win.webContents.send('dataUrl',parseData)
        // }else{
        //   win.webContents.send('OffLineDataUrl',parseData)
        //
        return size.width + '_' + size.height + '_' + dataUrl
    }
}

function downLoadOss(arg) {
    let msg = JSON.parse(arg[1].toString())
    if (msg.msgType === 'IMAGE') {
        console.log('downLoadOss: ', msg.message)
        return dowLoadImage(msg.message)
    } else if (msg.msgType === 'TEXT') {
        // if (arg[0] === 1){
        //   win.webContents.send('dataUrl',msg.message)
        // }else{
        //   win.webContents.send('OffLineDataUrl',msg.message)
        // }
        return new Promise((resolve) => resolve(msg.message))
    }
}

ipcMain.handle('saveChat', async (event, arg) => {
    let result = await saveChat(JSON.parse(arg))
    return result;
})

function saveChat(msg) {
    let data = [msg.msgSeq, msg.from, msg.to, msg.message, msg.msgType, msg.type]
    let insertSql = 'insert into lchat_message values (?,?,?,?,?,?)'
    db.insertData(insertSql, data)
    return 1
}

ipcMain.on('getSessions', ((event, args) => {
    let sessionSql = sql.getSession(args.toString())
    db.queryData(sessionSql, ((data) => {
        win.webContents.send('sessionsCallBack', data)
    }))
}))
ipcMain.on('insertGroupInfo', (((event, args) => {
    console.log(args.toString())
    let data = JSON.parse(args.toString())
    insertGroupInfo(data)
    event.returnValue = 'done'
})))

function insertGroupInfo(data) {
    let groupInfo = [data.groupCreator, data.groupId, data.groupName, data.groupCreator]
    console.log(groupInfo)
    let sql = 'insert into lchat_group_info values (?,?,?,?)'
    db.insertData(sql, groupInfo)
}

ipcMain.on('insertGroupMember', (((event, args) => {
    insertGroupMember(args)
    event.returnValue = 'done'
})))

function insertGroupMember(data) {
    let sql = 'insert into lchat_group_member values (?,?,?,?)'
    db.insertData(sql, data)
}

ipcMain.on('queryGroup', (((event, args) => {
    let sql = 'select * from lchat_group_info'
    db.queryData(sql, ((data) => {
        event.returnValue = data
    }))
})))

function writeToServer(msg) {
    socket.write(msg, () => {
        console.log('发送成功')
    })
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
    if (isDevelopment && !process.env.IS_TEST) {
        // Install Vue Devtools
        try {
            await installExtension(VUEJS_DEVTOOLS)
        } catch (e) {
            console.error('Vue Devtools failed to install:', e.toString())
        }
    }
    createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
    if (process.platform === 'win32') {
        process.on('message', (data) => {
            if (data === 'graceful-exit') {
                app.quit()
            }
        })
    } else {
        process.on('SIGTERM', () => {
            app.quit()
        })
    }
}
