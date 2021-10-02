<template>
    <!--聊天区域-->
    <a-col flex="auto" style="background-color: rgb(245, 245, 245)">
      <a-row style="top: 35%" v-if="!click">
        <a-empty :description="false">
        </a-empty>
      </a-row>
      <a-row v-if="click">
        <a-col style="background-color: rgb(247, 247, 247);height: 50px;display: block;border-bottom: 1px solid rgb(214,214,214)">
          <span style="font-size: 25px;margin-left: 40px"><b>{{leftUserInfo.username}}</b></span>
        </a-col>
        <a-col>
          <a-row>
            <a-col class="chatArea">
              <a-space direction="vertical" style="width: 100%">
                <div style="margin-top: 4px">
                  <p class="chatBox-time" >2021-08-22 9:32</p>
                  <div class="chatBox-left-li">
                    <a-avatar shape="square" class="chatBox-avatar" :src="leftUserInfo.avatar" :size="40"/>
                    <img src="https://lpepsi.oss-cn-shenzhen.aliyuncs.com/avatar.jpg"
                         class="chatBox-img-left">
                  </div>
                </div>
                <div style="margin-top: 4px">
                  <p class="chatBox-time" >2021-08-22 9:32</p>
                  <div class="chatBox-right-li">
                    <p class="chatBox-right-text">
                      sdaadsdas
                    </p>
                    <a-avatar shape="square" :size="40" class="chatBox-avatar" :src="userInfo.avatar" @click="showCard()"/>
                  </div>
                </div>
                <div style="margin-top: 4px">
                  <p class="chatBox-time" >2021-08-22 9:32</p>
                  <div class="chatBox-left-li">
                    <a-avatar shape="square"class="chatBox-avatar" :size="40" :src="leftUserInfo.avatar"/>
                    <p class="chatBox-left-text">asdasd</p>
                  </div>
                </div>
                <div style="margin-top: 4px">
                  <p class="chatBox-time" >2021-08-22 9:32</p>
                  <div class="chatBox-right-li">
                    <img src="https://lpepsi.oss-cn-shenzhen.aliyuncs.com/avatar.jpg" class="chatBox-img-right" alt="ddd">
                    <a-avatar shape="square" class="chatBox-avatar" :size="40" :src="userInfo.avatar"/>
                  </div>
                </div>
              </a-space>
            </a-col>
            <a-col style="width: 100%">
              <!--消息发送区域-->
              <div>
                <a-icon type="smile" style="font-size: 20px;margin-left: 17px;margin-top: 5px"></a-icon>
                <a-icon type="folder-open" style="font-size: 20px;margin-left: 10px;margin-top: 5px"></a-icon>
              </div>
              <div style="width: 100%">
                <textarea v-model="chat" class="area-text" wrap="hard" @keydown.enter="handleKeyCode($event)"/>
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

export default {
  name: "chat-area",
  data(){
    return {
      tip: false, // tooltip是否显示
      openCard: false,
      rightChat: [],
      leftChat: [],
      leftUserInfo:{},
      chat: '',
      click: false,
      userInfo: {},
      dbFile: '',
      db: null
    }
  },
  created() {
    this.init()
    ipcRenderer.on('receive',(event,arg) => {
      console.log(arg)
    })
    eventBus.$on('click', (data) => {
      console.log(data)
      this.click = true
      this.leftUserInfo = data
    })
  },
  methods: {
    init(){
      this.userInfo = this.$store.getters.getInfo
      this.db = this.$store.getters.getDB
    },
    showCard() {
      this.openCard = true
    },
    handleKeyCode(event){
      if (event.ctrlKey){
        let content = this.chat
        this.chat = content + '\n'
      }else {
        const data = {'msgSeq': new Date().getTime(), 'from': this.userInfo.id, 'to': '4028d5827c061895017c06195d8d0000','msgType': 'TEXT'};
        event.preventDefault()
        let content = this.chat.trim()
        if (content.length === 0){
          this.tip = true
          setTimeout( () => {
            this.tip = false
          },2500)
        }else {
          data.message = this.chat
          ipcRenderer.send('sendMsg',JSON.stringify(data)  + '\n')
        }
        this.chat = ''
      }
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
  position: relative;
  left: 45%;
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
  width: 100%;
  height:77px;
  border: solid 0;
  background-color:rgb(245, 245, 245);
  resize: none;
  outline: none
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