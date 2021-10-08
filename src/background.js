import { app, protocol, BrowserWindow,Menu ,ipcMain,dialog} from 'electron'
import net from 'net'
import {sqliteDB} from './js/db'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
const isDevelopment = process.env.NODE_ENV !== 'production'
// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])


let win;
let socket = null;

let db = null

function createConnect(message){
  socket = net.createConnection({
    host: '127.0.0.1',
    port: 7778
  });
  socket.on('connect', () => {
    // 向服务器发送数据
    writeToServer(message)
  })
  socket.on('data', buffer => {
    console.log(socket.localAddress+' : '+socket.localPort+' -> '+buffer.toString());
    win.webContents.send('receive',buffer.toString())
  });

  socket.on('end',() => {
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
    maxHeight:300,
    maxWidth:500,
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

ipcMain.on('login',(event,arg) => {
  let array = arg.split('*')
  createConnect(array[1].toString())
  db = new sqliteDB(array[0]+'.db');
  // win.setPosition(10,10)
  win.setMaximumSize(1250,735)
  win.setSize(1280,735)
  win.center()
  win.webContents.send('success','client')
})
ipcMain.on('updateFriend',(event,arg) =>{
  let deleteSql = 'delete from lchat_friend'
  db.executeSql(deleteSql)
  let insertSql = 'insert into lchat_friend values (?,?,?,?,?)'
  db.insertDataBatch(insertSql,arg)
})
ipcMain.on('queryFriend',() => {
  let querySql = 'select * from lchat_friend'
  db.queryData(querySql,((data) => {
    win.webContents.send('friendsInfo',data)
  }))
})
ipcMain.on('queryChats',(event,arg) => {

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
  querySql = querySql.replaceAll('?',arg[0])
  querySql = querySql.replaceAll('#',arg[1])
  db.queryData(querySql,((data) => {
    win.webContents.send('chats',data)
  }))
})
ipcMain.on('logout',(event,arg) => {
  win.setMaximumSize(500,300)
  win.setSize(500,300)
  win.center()
  const data = {'msgSeq': new Date().getTime(), 'from': arg, 'to': 'server','msgType': 'QUIT'};
  socket.end(JSON.stringify(data))
  event.sender.send('successLogout','to index')
})
ipcMain.on('sendMsg',(event,arg) => {
  writeToServer(arg.toString())
  saveChat(arg)
})
ipcMain.on('saveChat',(event,arg) => {
  saveChat(arg)
})
function saveChat(msg){
  let message = JSON.parse(msg)
  let data = [message.msgSeq,message.from,message.to,message.message,message.msgType]
  let insertSql = 'insert into lchat_message values (?,?,?,?,?)'
  db.insertData(insertSql,data)
}
function writeToServer(msg){
  socket.write(msg,()=>{
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
