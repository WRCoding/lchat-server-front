<template>
    <!--聊天区域-->
    <a-col flex="auto" style="background-color: rgb(245, 245, 245)">
      <a-row style="top: 35%" v-if="!click && !toInfo">
        <a-empty :description="false">
        </a-empty>
      </a-row>
      <a-row v-if="click && !toInfo">
        <a-col style="background-color: rgb(247, 247, 247);height: 50px;display: block;border-bottom: 1px solid rgb(214,214,214)">
          <span style="font-size: 25px;margin-left: 40px"><b>{{leftUserInfo.username}}</b></span>
        </a-col>
        <a-col>
          <a-row>
            <a-col class="chatArea">
              <a-space direction="vertical" style="width: 100%">
                <div style="margin-top: 4px" v-for="chat in chats">
                  <p class="chatBox-time" >{{time(chat.msgSeq)}}</p>
                  <div v-bind:class="{'chatBox-left-li': chat.from === leftUserInfo.userid,'chatBox-right-li': chat.from === userInfo.id}">
                    <p v-if="chat.msgType === 'TEXT' && chat.from === userInfo.id" class="chatBox-right-text">
                      {{chat.message}}
                    </p>
                    <img v-if="chat.msgType === 'IMAGE' && chat.from === userInfo.id" :src="getUrl(chat.message)"
                         class="chatBox-img-right">
                    <a-avatar v-if="chat.from === leftUserInfo.userid" shape="square" class="chatBox-avatar" :src="leftUserInfo.avatar" :size="40"/>
                    <a-avatar v-if="chat.from === userInfo.id" shape="square" class="chatBox-avatar" :src="userInfo.avatar" :size="40"/>
                    <p v-if="chat.msgType === 'TEXT' && chat.from === leftUserInfo.userid" class="chatBox-left-text">{{chat.message}}</p>
                    <img v-if="chat.msgType === 'IMAGE' && chat.from === leftUserInfo.userid" :src="getUrl(chat.message)"
                         class="chatBox-img-left">

                  </div>
                </div>
              </a-space>
            </a-col>
            <a-col style="width: 100%">
              <!--消息发送区域-->
              <div>
                <a-icon type="smile" style="font-size: 20px;margin-left: 17px;margin-top: 5px"></a-icon>
                <a-upload :before-upload="beforeUpload" list-type="picture">
                  <a-icon type="folder-open" style="font-size: 20px;margin-left: 10px;margin-top: 5px"></a-icon>
                </a-upload>
              </div>
              <div style="width: 100%">
                <div v-viewer="options" ref="areatext" contenteditable="true" v-model="chat" class="area-text"  v-on:keyup.ctrl.86="paste()" @keydown.enter="handleKeyCode($event) ">
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
                  <button class="send-btn" >发送</button>
                </a-tooltip>
              </div>
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
            <a-card-meta >
              <template slot="title">
                {{friendInfo.username}}
              </template>
              <template slot="description">
                {{friendInfo.description}}
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
import { ipcRenderer } from 'electron'
import image from '../js/image'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
const isToday = require('dayjs/plugin/isToday');
const isYesterday = require('dayjs/plugin/isYesterday');
dayjs.locale('zh-cn')
dayjs.extend(isYesterday)
dayjs.extend(isToday)
const clipboard = require('electron').clipboard
export default {
  name: "chat-area",
  data(){
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
      leftChat: [],
      leftUserInfo:{},
      chat: '',
      click: false,
      toInfo: false,
      userInfo: {},
      friendInfo: {},
      dbFile: '',
      db: null,
      pasteUrls: [],
      formalUrls: []
    }
  },
  created() {
    ipcRenderer.on('receive',(event,arg) => {
      this.chats.push(JSON.parse(arg.toString()))
      ipcRenderer.send('saveChat',arg)
    })
    eventBus.$on('click', (data) => {
      this.chats = []
      this.click = true
      this.leftUserInfo = data
      console.log('leftUserInfo',this.leftUserInfo)
      ipcRenderer.send('queryChats',[this.userInfo.id,this.leftUserInfo.userid])
      ipcRenderer.on('chats',((event, arg) => {
        // console.log('chats: ', arg)
        this.chats = arg
      }))
    })
    eventBus.$on('toInfo',(data) => {
      this.toInfo = true
      this.friendInfo = data
    })
    this.init()
  },
  methods: {
    init(){
      this.userInfo = this.$store.getters.getInfo
      this.db = this.$store.getters.getDB
      this._day = dayjs
    },
    getUrl(message){
      console.log(message)
      let ossUrl = 'https://lchat-server.oss-cn-shenzhen.aliyuncs.com/' + message
      console.log(ossUrl)
      return ossUrl
    },
    getMessage(event){
      console.log(event)
    },
    beforeUpload() {
      return false;
    },
    openDialog(){
      ipcRenderer.send('openDialog','')
    },
    paste(){
      if (!clipboard.readImage().isEmpty()){
        let image = clipboard.readImage()
        this.formalUrls.push(image.toDataURL())
        console.log(image.getSize())
        console.log(image.getAspectRatio())
        let width = image.getSize().width
        let height = image.getSize().height
        let ratio = image.getAspectRatio()
        let reSizeHeight = height/ratio
        console.log('width: '+width+' height: '+reSizeHeight)
        let resizeImage = image.resize({width:100,height:50,quality: 'good'})
        console.log(resizeImage.getSize())
        console.log(resizeImage.getAspectRatio())
        this.pasteUrls.push({thumbnail:image.toDataURL(),source:resizeImage.toDataURL()})
      }else{
        console.log(clipboard.readText())
      }
    },
    toChat(){
      eventBus.$emit('session',this.friendInfo)
      this.toInfo = false
    },
    time(val){
      if (this._day(val).isToday()){
        let time = this._day(val).format('HH:mm')
        return time
      }else if (this._day(val).isYesterday()){
        let time = this._day(val).format('昨天 HH:mm')
        return time
      }else{
        let time = this._day(val).format('YYYY-MM-DD HH:mm')
        return time
      }

    },
    showCard() {
      this.openCard = true
    },
    handleKeyCode(event){
      console.log('event: ',event)
      event.preventDefault()
      if (event.target.childNodes.length === 0){
            this.tip = true
            setTimeout( () => {
              this.tip = false
            },2500)
      }else{
        let message = event.target.innerText
        console.log('message: '+message)
        if (message.length > 0){
          let segment = {}
          segment.msgSeq = new Date().getTime()
          segment.from = this.userInfo.id
          segment.to = this.leftUserInfo.userid
          segment.message = message
          segment.msgType = 'TEXT'
          this.chats.push(segment)
          console.log(segment)
          // ipcRenderer.send('sendMsg',JSON.stringify(segment)  + '\n')
        }
        for (let i = 0; i < this.formalUrls.length; i++) {
          let base64 = this.formalUrls[i].replace('data:image/png;base64,','')
          let filename = 'LChat-'+this.userInfo.userName+'-'+new Date().getTime()+'-'+this.leftUserInfo.username
          let result = image.imageToFile(base64,filename)
          let segment = {}
          segment.msgSeq = new Date().getTime()
          segment.from = this.userInfo.id
          segment.to = this.leftUserInfo.userid
          segment.message = filename
          segment.msgType = 'IMAGE'
          console.log(segment)
          ipcRenderer.send('sendMsg',JSON.stringify(segment)  + '\n')
        }
        event.target.innerHTML = ''
      }

      // if (event.ctrlKey){
      //   let content = this.chat
      //   this.chat = content + '\n'
      // }else {
      //
      //   let content = this.chat.trim()
      //   if (content.length === 0){
      //     this.tip = true
      //     setTimeout( () => {
      //       this.tip = false
      //     },2500)
      //   }else {
      //
      //   }
      //   this.chat = ''
      // }


    }

  }
}
</script>

<style scoped>

ul{
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

.chatBox-time{
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

.send-btn{
  float: right;
  margin-right: 15px;
  border: solid 0;
  outline: none;
  width: 50px;
  border-radius: 10px;
}
.send-btn:hover{
  color: white;
  background-color:rgb(18, 150, 17);
  border: solid 0;
}
.send-btn:active{
  color: white;
  background-color:rgb(18, 150, 17);
  border: solid 0;
}
.area-text{

  padding: 10px;
  width: 869px;
  height:77px;
  border: solid 0;
  background-color:rgb(245, 245, 245);
  resize: none;
  outline: none;
  word-wrap: break-word;
  word-break: break-all;
  overflow-y: auto;
  -webkit-user-modify: read-write-plaintext-only;
}
.chatBox-img-left{
  border-radius: 5px;
  display: inline-block;
  margin-left: 10px;
  width:100px;
  height:200px
}
.chatBox-img-right{
  border-radius: 5px;
  display: inline-block;
  margin-right: 10px;
  width:100px;
  height:200px
}
.chatBox-avatar{
  display: inline-block;
  vertical-align: top;
}
.chatBox-left-li{
  float:left;
  margin-left: 2px
}
.chatBox-right-li{
  float: right;
  margin-right: 7px;
  margin-top: 10px;
  margin-bottom: 4px
}

</style>