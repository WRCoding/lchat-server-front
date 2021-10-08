<template>
  <!--搜索和好友列表-->
  <a-col flex="300px" style="border-right:1px solid rgb(214, 214, 214);">
    <a-row>
      <a-col style="background-color: rgb(247, 247, 247);height: 50px;display: block">
            <span>
              <a-input placeholder="搜索" size="small" allowClear v-model="search" @change="searchValue"
                       style="width: 200px;background-color: rgb(226, 226, 226);margin-top: 14px;margin-left: 40px">
              </a-input>
              <a-dropdown >
                <a-menu slot="overlay"  @click="handleMenuClick">
                  <a-menu-item key="addUser"> <a-icon type="user"/>添加好友</a-menu-item>
                  <a-menu-item key="addGroup"><a-icon type="team" />创建群聊</a-menu-item>
                </a-menu>
                <a-button size="small" style="background-color: rgb(226, 226, 226);margin-left: 10px" icon="plus"/>
              </a-dropdown>
            </span>
      </a-col>
      <!--会话列表-->
      <a-col v-if="action === 1" class="chat-list" style="background-color: rgb(228, 228, 229);height:650px;max-height: 650px;display: block;cursor: pointer">
        <div v-if="search.length === 0" class="chat-list-card" @click="toChat(item)" style="width: 300px;background-color: rgb(232, 231, 230);padding: 10px 5px" v-for="item in sessionList">
          <a-space align="center" style="width: 100%;display: flex">
            <a-badge><a-avatar :size="45" shape="square" :src="item.avatar" /></a-badge>
            <a-space direction="vertical" style="margin-left: 7px;flex-grow: 1">
              <a-space><span><b style="font-size: 14px">{{item.username}}</b></span><span style="margin-right: auto;font-size: 10px">{{time(item.msgSeq)}}</span></a-space>
              <span>{{item.newMsg}}</span>
            </a-space>
          </a-space>
        </div>
        <!-- 搜索用户时的列表-->
        <div v-if="search.length > 0" style="width: 300px;background-color: rgb(232, 231, 230);padding: 10px 5px" v-for="item in searchList">
          <a-space align="center">
            <a-badge :count="77"><a-avatar :size="45" shape="square" :src=item.avatar /></a-badge>
            <a-space direction="vertical" style="margin-left: 7px">
              <a-space><span><b style="font-size: 14px">Block</b></span><span style="float: left;font-size: 10px">21/9/11</span></a-space>
              <span>{{item.name}}</span>
            </a-space>
          </a-space>
        </div>
      </a-col>
      <!--好友列表-->
      <a-col v-if="action === 2" class="chat-list" style="background-color: rgb(228, 228, 229);height:650px;max-height: 650px;display: block;cursor: pointer">
        <div class="chat-list-card" @click="toInfo(item)" style="width: 300px;background-color: rgb(232, 231, 230);padding: 10px 5px;display: flex;align-items: center" v-for="item in friendList">
            <a-avatar :size="45" shape="square" :src="item.avatar" />
            <span style="margin-left: 20px"><b style="font-size: 20px">{{item.username}}</b></span>
        </div>
      </a-col>
    </a-row>
    <a-divider type="vertical"/>
     <a-modal v-model="visible" :footer="null" centered>
      <a-input
          v-model="userSearch"
          placeholder="名称或者ID"
          style="width: 200px"
          @change="searchUser()"
      >
      </a-input>
      <a-tag color="#108ee9" style="margin-left: 27px"> 添加好友</a-tag>
      <a-card style="margin-top: 7px;overflow-y: auto;max-height: 430px" >
        <a-list item-layout="horizontal" :data-source="userList">
          <a-list-item slot="renderItem" slot-scope="item, index">
            <a slot="actions" @click="addFriend(item.id)"><a-icon type="user-add" /></a>
            <a-list-item-meta
                :description=item.description
            >
              <a slot="title">{{ item.userName }}</a>
              <a-avatar
                  slot="avatar"
                  :src=item.avatar
              />
            </a-list-item-meta>
          </a-list-item>
        </a-list>
      </a-card>
    </a-modal>
  </a-col>
</template>

<script>
import {eventBus} from '../main'
import { ipcRenderer } from 'electron'
import user from '../js/user'
import friend from '../js/friend'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
const isToday = require('dayjs/plugin/isToday');
const isYesterday = require('dayjs/plugin/isYesterday');
dayjs.locale('zh-cn')
dayjs.extend(isYesterday)
dayjs.extend(isToday)
export default {
  name: "chat-list",
  data() {
    return {
      _day: '',
      visible: false,
      userList: [],
      friendList: [],
      userSearch: '',
      chatList: [],
      searchList: [],
      search: '',
      action: 1,
      sessionList: []
    }
  },
  created() {
    this._day = dayjs
    this.queryFriends()
    ipcRenderer.on('friendsInfo',((event, args) => {
      this.friendList = args
      console.log('friendList: ',this.friendList)
    }))
    eventBus.$on('changeAction',(data) => {
      this.action = data
    })
    eventBus.$on('session',(data) => {
      this.action = 1
      let exist = this.sessionList.some(session => {
          if (session.userid === data.userid){
            return true
          }
      })
      if (!exist){
        this.sessionList.unshift(data)
      }
      this.toChat(data)
    })
    ipcRenderer.on('receive',(event,arg) => {
      this.action = 1
      let message = JSON.parse(arg.toString())
      console.log('message : ',message)
      let exist = this.sessionList.some(session => {
        if (session.userid === message.from){
          session.msgSeq = message.msgSeq
          session.newMsg = message.message
          return true
        }
      })
      if (!exist){
        this.friendList.some(friend => {
          if (friend.userid === message.from){
            friend.msgSeq = message.msgSeq
            friend.newMsg = message.message
            this.sessionList.unshift(friend)
          }
        })
      }
      console.log('sessionList: ',this.sessionList)
      this.sessionList.sort((session_1,session_2) => {
        return session_2.msgSeq-session_1.msgSeq
      })
    })
  },
  methods: {
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
    queryFriends(){
      let currentId = this.$store.getters.getInfo.id
      const friends = [];
      friend.getFriends(currentId).then(response => {
        let data = response.data.data
        for (let i = 0; i<data.length; i++){
          let friend = [data[i].id,data[i].userName,data[i].avatar,data[i].background,data[i].description]
          friends.push(friend)
        }
        ipcRenderer.send('updateFriend',friends)
        ipcRenderer.send('queryFriend','')
      })
    },
    toChat(val){
      eventBus.$emit('click', val)
    },
    toInfo(val){
      eventBus.$emit('toInfo', val)
    },
    addFriend(id){
      let currentId = this.$store.getters.getInfo.id
      let data = {'userId':currentId,'friendId':id}
      console.log('currentId: '+currentId+' , id: '+id)
      friend.addFriend(JSON.stringify(data)).then(response => {
        console.log(response)
        if (response.data.code === 200){
          this.queryFriends()
        }
      })
    },
    searchValue(e){
      console.log(this.search)
    },
    searchUser(){
      console.log(this.userSearch)
      let key =  this.userSearch.trim()
      if (key.length === 0){
        this.userList = []
      }
      if (key.length > 0){
        user.search(this.userSearch).then((response) => {
          if (response.data.code === 200){
            this.userList = response.data.data
          }
          console.log(this.userList)
        })
      }
    },
    handleMenuClick(e) {
      if (e.key === 'addUser'){
        this.visible = true
      }
    }
  }
}
</script>

<style scoped>
.chat-list{
  overflow-y: hidden;
}
.chat-list:hover{
  overflow-y: auto;
}
</style>