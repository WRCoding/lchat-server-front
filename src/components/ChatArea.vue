<template>
  <!--聊天区域-->
  <a-col flex="auto" style="background-color: rgb(245, 245, 245)">
    <a-row style="top: 35%" v-if="click === 0 && !toInfo">
      <a-empty :description="false">
      </a-empty>
    </a-row>
    <a-row v-if="click !== 0 && !toInfo">
      <a-col v-if="click === 1"
             style="background-color: rgb(247, 247, 247);height: 50px;display: block;border-bottom: 1px solid rgb(214,214,214)">
        <span style="font-size: 25px;margin-left: 40px"><b>{{ leftUserInfo.username }}</b></span>
      </a-col>
      <!-- 群聊名称-->
      <a-col v-if="click === 2"
             style="background-color: rgb(247, 247, 247);height: 50px;display: block;border-bottom: 1px solid rgb(214,214,214)">
        <span style="font-size: 25px;margin-left: 40px"><b>{{ groupInfo.group_name }}</b></span>
      </a-col>
      <a-col>
        <a-row>
          <a-col class="chatArea">
            <a-space direction="vertical" style="width: 100%">
              <!-- 单聊-->
              <div v-if="click === 1" style="margin-top: 4px" v-for="chat in chats">
                <p class="chatBox-time">{{ time(chat.msgSeq) }}</p>
                <div
                    v-bind:class="{'chatBox-left-li': chat.from === leftUserInfo.lcid,'chatBox-right-li': chat.from === userInfo.lcid}">
                  <p v-if="chat.msgType === 'TEXT' && chat.from === userInfo.lcid" class="chatBox-right-text">
                    {{ chat.message }}
                  </p>
                  <img v-if="chat.msgType === 'IMAGE' && chat.from === userInfo.lcid" :src="getUrl(chat.message)"
                       class="chatBox-img-right">
                  <a-avatar v-if="chat.from === leftUserInfo.lcid" shape="square" class="chatBox-avatar"
                            :src="leftUserInfo.avatar" :size="40"/>
                  <a-avatar v-if="chat.from === userInfo.lcid" shape="square" class="chatBox-avatar"
                            :src="userInfo.avatar" :size="40"/>
                  <p v-if="chat.msgType === 'TEXT' && chat.from === leftUserInfo.lcid" class="chatBox-left-text">
                    {{ chat.message }}</p>
                  <img v-if="chat.msgType === 'IMAGE' && chat.from === leftUserInfo.lcid" :src="getUrl(chat.message)"
                       class="chatBox-img-left">
                </div>
              </div>
              <!-- 群聊-->
              <div v-if="click === 2" style="margin-top: 4px" v-for="groupChat in groupChats">
                <div v-if="groupChat.to === groupInfo.group_id">
                  <p class="chatBox-time">{{ time(groupChat.msgSeq) }}</p>
                  <div
                      v-bind:class="{'chatBox-left-li': groupChat.from !== userInfo.lcid,'chatBox-right-li': groupChat.from === userInfo.lcid}">
                    <p v-if="groupChat.msgType === 'TEXT' && groupChat.from === userInfo.lcid"
                       class="chatBox-right-text">
                      {{ groupChat.message }}
                    </p>
                    <img v-if="groupChat.msgType === 'IMAGE' && groupChat.from === userInfo.lcid"
                         :src="getUrl(groupChat.message)"
                         class="chatBox-img-right">
                    <a-avatar v-if="groupChat.from !== userInfo.lcid" shape="square" class="chatBox-avatar"
                              :src="getGroupMemberAvatar(groupChat.from)" :size="40"/>
                    <a-avatar v-if="groupChat.from === userInfo.lcid" shape="square" class="chatBox-avatar"
                              :src="userInfo.avatar" :size="40"/>
                    <span v-if="groupChat.msgType === 'TEXT' && groupChat.from !== userInfo.lcid"
                          style="display: inline-block">
                      <p style="margin-left: 10px;margin-bottom: 0px;font-size: 12px;color: rgb(179, 179, 179)">{{ getGroupMemberName(groupChat.from) }}</p>
                      <p class="chatBox-left-text">{{ groupChat.message }}</p>
                    </span>
                    <span v-if="groupChat.msgType === 'IMAGE' && groupChat.from !== userInfo.lcid" style="display: inline-block">
                      <p style="margin-left: 10px;margin-bottom: 0px;font-size: 12px;color: rgb(179, 179, 179)">{{ getGroupMemberName(groupChat.from) }}</p>
                      <img :src="getUrl(groupChat.message)" class="chatBox-img-left" />
                    </span>

                  </div>
                </div>
              </div>
            </a-space>
          </a-col>
          <!--消息发送区域-->
          <a-col style="width: 100%" @contextmenu="showMenu($event)">
            <div>
              <a-icon type="smile" style="font-size: 20px;margin-left: 17px;margin-top: 5px"></a-icon>
              <a-upload :before-upload="beforeUpload" list-type="picture">
                <a-icon type="folder-open" style="font-size: 20px;margin-left: 10px;margin-top: 5px"></a-icon>
              </a-upload>
            </div>
            <div style="width: 100%">
              <div v-viewer="options" ref="areatext" contenteditable="true" v-model="chat" class="area-text"
                   v-on:keydown.meta.86="paste()" @keydown.enter="handleKeyCode($event) ">
                <template v-for="(image,index) in pasteUrls">
                  <img
                      :src="image.source" class="image" :key="index"
                      :data-src="image.thumbnail"
                  >
                </template>
              </div>
            </div>
            <div>
              <a-tooltip :visible="tip" placement="topLeft">
                <template slot="title">
                  消息不能为空
                </template>
                <button class="send-btn">发送</button>
              </a-tooltip>
            </div>
            <vue-context-menu :contextMenuData="contextMenudata" @paste="paste"></vue-context-menu>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
    <a-row v-if="toInfo" style="height: 100%">
      <div style="height: 400px;width: 400px;margin: 0 auto;position: relative;top: 50%;transform: translateY(-50%);">
        <a-card hoverable style="width: 300px">
          <img
              slot="cover"
              alt="example"
              width="200px"
              height="200px"
              :src="friendInfo.background"
          />
          <a-card-meta>
            <template slot="title">
              {{ friendInfo.username }}
            </template>
            <template slot="description">
              {{ friendInfo.description }}
            </template>
            <a-avatar
                slot="avatar"
                :src="friendInfo.avatar"
            />
          </a-card-meta>
          <template slot="actions" class="ant-card-actions">
            <a-button type="link" @click="toChat()">
              发消息
            </a-button>
          </template>
        </a-card>
      </div>
    </a-row>
    <a-modal v-model="openCard" :footer="null" :closable="false" :width="300">
      <a-card style="border: solid 0">
        <img
            slot="cover"
            alt="example"
            height="300px"
            :src="userInfo.background"
        />
        <a-card-meta>
          <template slot="title">
            <span>{{ userInfo.userName }}</span>
          </template>
          <template slot="description">
            <span>{{ userInfo.description }}</span>
          </template>
          <a-avatar
              slot="avatar"
              :src="userInfo.avatar"
          />
        </a-card-meta>
      </a-card>
    </a-modal>
  </a-col>
</template>

<script>
import {eventBus} from '../main'
import {ipcRenderer} from 'electron'


const nativeImage = require('electron').nativeImage
import image from '../js/image'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import {sqliteDB} from '../js/db'

let db = null
db = new sqliteDB('xw.db');

const isToday = require('dayjs/plugin/isToday');
const isYesterday = require('dayjs/plugin/isYesterday');
dayjs.locale('zh-cn')
dayjs.extend(isYesterday)
dayjs.extend(isToday)
const clipboard = require('electron').clipboard
export default {
  name: "chat-area",
  data() {
    return {
      options: {
        url: 'data-src'
      },
      upload: false,
      _day: '',
      tip: false, // tooltip是否显示
      openCard: false,
      rightChat: [],
      chats: [],
      groupChats: [],
      leftChat: [],
      leftUserInfo: {},
      groupInfo: {},
      groupMembers: [],
      chat: '',
      //0:展示个人信息,1:单聊,2:群聊
      click: 0,
      toInfo: false,
      userInfo: {},
      friendInfo: {},
      dbFile: '',
      db: null,
      pasteUrls: [],
      message: '',
      contextMenudata: {
        menuName: 'menu',
        axis: {
          x: null,
          y: null
        },
        menulists: [{
          fnHandler: 'paste',
          btnName: '粘贴',
          icoName: 'fa fa-home fa-fw'
        }]
      }
    }
  },
  created() {
    this.groupChats = []
    this.chats = []
    eventBus.$on('singleChat', (data) => {
      this.chats = []
      this.click = 1
      this.leftUserInfo = data
      console.log('leftUserInfo', this.leftUserInfo)
      ipcRenderer.send('querySingleChats', [this.userInfo.lcid, this.leftUserInfo.lcid])
      ipcRenderer.on('chats', ((event, arg) => {
        this.chats = arg
      }))
    })
    eventBus.$on('groupChat', (data) => {
      this.groupChats = []
      this.click = 2
      this.groupInfo = data
      let members = ipcRenderer.sendSync('queryGroupMembers', data.group_id)
      this.groupChats = ipcRenderer.sendSync('queryGroupChats', data.group_id)
      this.groupMembers = members
      console.log('members: ', this.groupMembers)
      console.log('groupChats: ', this.groupChats)
    })
    eventBus.$on('toInfo', (data) => {
      this.toInfo = true
      this.friendInfo = data
    })
    this.init()
  },
  methods: {
    init() {
      let temp;
      //这里可以记笔记,不能再on里面连续使用send ,on
      //这里接收到消息后，去判断是否是图片，如果是图片，把图片下载下来
      //接受单聊和群聊的
      ipcRenderer.on('receive', (event, arg) => {
        temp = JSON.parse(arg.toString())
        //图片下载下来后，生成dataUrl存在消息体中，接着保存
        ipcRenderer.invoke('downLoadOss', [1, arg.toString()]).then((data) => {
          temp.message = data.toString()
          ipcRenderer.invoke('saveChat', JSON.stringify(temp)).then(() => {
            console.log('type: ', temp.type)
            if (temp.type === 'SINGLE') {
              this.chats.push(temp)
            } else {
              console.log('groupChats: ', this.groupChats)
              this.groupChats.push(temp)
            }
          })
        })
      })
      //图片下载下来后，生成dataUrl存在消息体中，接着保存
      // ipcRenderer.on('dataUrl', ((event,arg) => {
      //   temp.message = arg.toString()
      //   ipcRenderer.send('saveChat',JSON.stringify(temp))
      //   this.chats.push(temp)
      // }))
      this.userInfo = this.$store.getters.getInfo
      this.db = this.$store.getters.getDB
      this._day = dayjs
    },
    showMenu(event) {
      event.preventDefault()
      let x = event.clientX
      let y = event.clientY
      this.contextMenudata.axis = {
        x, y
      }
    },
    //获取群成员头像
    getGroupMemberAvatar(lcid) {
      let member = this.groupMembers.find(member => member.lcid === lcid)
      console.log('member: ', member)
      return member.avatar
    },
    //获取群成员名称
    getGroupMemberName(lcid) {
      let member = this.groupMembers.find(member => member.lcid === lcid)
      console.log('member: ', member)
      return member.username
    },
    getUrl(parseData) {
      let parseDataArray = parseData.split('_')
      let dataUrl = parseDataArray[2]
      let image = nativeImage.createFromDataURL(dataUrl)
      let width = image.getSize().width
      let height = image.getSize().height
      width = parseDataArray[0]
      height = parseDataArray[1]
      let resizeImage = image.resize({
        width: parseInt(parseDataArray[0]),
        height: parseInt(parseDataArray[1]),
        quality: 'better'
      })
      return resizeImage.toDataURL()
    },
    getMessage(event) {
      console.log(event)
    },
    beforeUpload() {
      return false;
    },
    openDialog() {
      ipcRenderer.send('openDialog', '')
    },
    paste() {
      if (!clipboard.readImage().isEmpty()) {
        let image = clipboard.readImage()
        console.log(image.getSize())
        console.log(image.getAspectRatio())
        let width = image.getSize().width
        let height = image.getSize().height
        let ratio = image.getAspectRatio()
        if (ratio >= 1 && ratio <= 2) {
          width = 150
          height = 100
        } else if (ratio < 1) {
          width = 50
          height = 100
        } else {
          width = 100
          height = 50
        }
        let resizeImage = image.resize({width: width, height: height, quality: 'good'})
        console.log(resizeImage.getSize())
        this.pasteUrls.push({thumbnail: image.toDataURL(), source: resizeImage.toDataURL(), size: {width, height}})
      } else {
        console.log(clipboard.readText())
      }
    },
    toChat() {
      eventBus.$emit('session', this.friendInfo)
      this.toInfo = false
    },
    time(val) {
      if (this._day(val).isToday()) {
        let time = this._day(val).format('HH:mm')
        return time
      } else if (this._day(val).isYesterday()) {
        let time = this._day(val).format('昨天 HH:mm')
        return time
      } else {
        let time = this._day(val).format('YYYY-MM-DD HH:mm')
        return time
      }

    },
    showCard() {
      this.openCard = true
    },
    handleKeyCode(event) {
      event.preventDefault()
      if (event.target.childNodes.length === 0) {
        this.tip = true
        setTimeout(() => {
          this.tip = false
        }, 2500)
      } else {
        let message = event.target.innerText
        if (message.length > 0) {
          let segment = {}
          segment.msgSeq = new Date().getTime()
          segment.from = this.userInfo.lcid
          segment.to = this.click === 2 ? this.groupInfo.group_id : this.leftUserInfo.lcid
          segment.message = message
          //判断是单聊还是群聊
          segment.msgType = 'TEXT'
          segment.type = this.click === 2 ? 'GROUP' : 'SINGLE'
          ipcRenderer.send('sendMsg', JSON.stringify(segment) + '\n')
          ipcRenderer.invoke('saveChat', JSON.stringify(segment))
          this.click === 2 ? this.groupChats.push(segment) : this.chats.push(segment)
        }
        for (let i = 0; i < this.pasteUrls.length; i++) {
          let dataUrl = this.pasteUrls[i].thumbnail
          let base64 = dataUrl.replace('data:image/png;base64,', '')
          let size = this.pasteUrls[i].size
          let filename = 'LChat-' + this.userInfo.userName + '-' + new Date().getTime() + '-' + size.width + '-' + size.height + '-' + this.leftUserInfo.username
          let success = image.imageToFile(base64, filename)
          success.then((data) => {
            if (data) {
              let segment = {}
              segment.msgSeq = new Date().getTime()
              segment.from = this.userInfo.lcid
              segment.to = this.click === 2 ? this.groupInfo.group_id : this.leftUserInfo.lcid
              segment.message = filename
              segment.msgType = 'IMAGE'
              //判断是单聊还是群聊
              segment.type = this.click === 2 ? 'GROUP' : 'SINGLE'
              ipcRenderer.send('sendMsg', JSON.stringify(segment) + '\n')
              segment.message = size.width + '_' + size.height + '_' + dataUrl
              segment.method = 'image'
              ipcRenderer.invoke('saveChat', JSON.stringify(segment))
              this.click === 2 ? this.groupChats.push(segment) : this.chats.push(segment)
            }
          })
        }
        event.target.innerHTML = ''
        this.pasteUrls = []
      }
    }

  }
}
</script>

<style scoped>

ul {
  list-style-type: none;
}

.chatArea {
  height: 500px;
  border-bottom: 1px solid rgb(214, 214, 214);
  overflow-y: hidden;
  max-height: 500px;
}

.chatArea:hover {
  overflow-y: auto;
}

.chatBox-time {
  margin: 0 auto;
  background-color: rgb(218, 218, 218);
  color: white;
  border-radius: 5px;
  font-size: 12px;
  padding: 3px;
  width: fit-content;
  border: solid 1px;
}

.chatBox-right-text {
  border: 1px solid rgb(214, 214, 214);
  border-radius: 5px;
  padding: 10px 10px;
  background-color: rgb(152, 225, 101);
  margin-right: 10px;
  display: inline-block;
  word-wrap: break-word;
  max-width: 230px;
  position: relative;
}

.chatBox-right-text::after {
  white-space: pre-line;
  content: ' ';
  display: inline-block;
  border: solid 6px red;
  border-top-color: transparent;
  border-bottom-color: transparent;
  border-right-color: transparent;
  border-left-color: rgb(152, 225, 101);
  position: absolute;
  top: 6px;
  right: -12px;
}

.chatBox-left-text {
  border: 1px solid rgb(240, 240, 240);
  background-color: rgb(255, 255, 255);
  border-radius: 5px;
  padding: 10px 10px;
  margin-left: 10px;
  display: inline-block;
  word-wrap: break-word;
  max-width: 230px;
  position: relative;
}

.chatBox-left-text::after {
  content: ' ';
  display: inline-block;
  border: 6px solid transparent;
  border-right-color: rgb(255, 255, 255);
  position: absolute;
  top: 6px;
  left: -12px;
}

.send-btn {
  float: right;
  margin-right: 15px;
  border: solid 0;
  outline: none;
  width: 50px;
  border-radius: 10px;
}

.send-btn:hover {
  color: white;
  background-color: rgb(18, 150, 17);
  border: solid 0;
}

.send-btn:active {
  color: white;
  background-color: rgb(18, 150, 17);
  border: solid 0;
}

.area-text {

  padding: 10px;
  width: 869px;
  height: 77px;
  border: solid 0;
  background-color: rgb(245, 245, 245);
  resize: none;
  outline: none;
  word-wrap: break-word;
  word-break: break-all;
  overflow-y: auto;
  -webkit-user-modify: read-write-plaintext-only;
}

.chatBox-img-left {
  border-radius: 5px;
  display: inline-block;
  margin-left: 10px;
  /*width:100px;*/
  /*height:200px*/
}

.chatBox-img-right {
  border-radius: 5px;
  display: inline-block;
  margin-right: 10px;
  /*width:100px;*/
  /*height:200px*/
}

.chatBox-avatar {
  display: inline-block;
  vertical-align: top;
}

.chatBox-left-li {
  float: left;
  margin-left: 2px
}

.chatBox-right-li {
  float: right;
  margin-right: 7px;
  margin-top: 10px;
  margin-bottom: 4px
}

</style>