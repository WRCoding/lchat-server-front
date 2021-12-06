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
                  <a-menu-item key="addUser"><a-icon type="user-add" />添加好友</a-menu-item>
                  <a-menu-item key="addGroup"><a-icon type="usergroup-add" />创建群聊</a-menu-item>
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
      <!--群聊列表-->
      <a-col v-if="action === 3" class="chat-list" style="background-color: rgb(228, 228, 229);height:650px;max-height: 650px;display: block;cursor: pointer">
        <div class="chat-list-card" @click="toInfo(item)" style="width: 300px;background-color: rgb(232, 231, 230);padding: 10px 5px;display: flex;align-items: center" v-for="item in friendList">
          <a-avatar :size="45" shape="square" :src="item.avatar" />
          <span style="margin-left: 20px"><b style="font-size: 20px">{{item.username}}</b></span>
        </div>
      </a-col>
    </a-row>
    <a-divider type="vertical"/>
    <!--添加好友的modal    -->
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
            <a slot="actions" @click="addFriend(item.lcid)"><a-icon type="user-add" /></a>
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
    <!--创建群聊的modal    -->
    <a-modal v-model="addGroupVisible" :footer="null" centered width=600px>
      <a-row>
        <a-col :span="12" id="unSelectedUser-Group-Col" style="width: 275px;height: 480px;border-right: 1px solid rgb(241, 241, 241)">
          <div style="margin-bottom: 10px;height: 50px">
            <a-input-search  style="width: 250px"/>
          </div>
          <div style="height: 75%;overflow-y: auto" id="unSelectedUser-Group-List">
            <div v-for="friend in friendList" :class="[{'click-Group-Li':keys.includes(friend)},'group-Li']" @click="getIndex(friend)">
              <a-space align="center" style="padding: 7px;">
                <a-avatar shape="square" :src="friend.avatar" :size="57" icon="user" />
                <span style="font-weight: bold;padding: 7px;font-size: 17px">{{friend.username}}</span>
              </a-space>
            </div>
          </div>
        </a-col>
        <a-col :span="12" id="selectedUser-Group-Col" style="width: 275px;height: 480px">
          <div style="margin-bottom: 10px;height: 50px">
            <span style="position: relative;bottom: 0px;font-size: 17px;padding: 10px" v-if="keys.length === 0">
              请勾选需要添加的联系人
            </span>
            <span style="position: relative;bottom: 0px;font-size: 17px;padding: 10px" v-if="keys.length > 0">
              已选择了{{keys.length}}个联系人
            </span>
            <span v-if="keys.length > 0" style="font-size: 12px;font-weight: bold">
              (点击取消选择)
            </span>
          </div>
          <div style="height: 50%">
            <div v-for="friend in keys" class="selectUser-Group-Li" @click="removeIndex(friend)">
              <a-space align="center" style="padding: 7px;">
                <a-avatar shape="square" :src="friend.avatar" size="large" icon="user" />
                <span style="font-weight: bold;padding: 7px">{{friend.username}}</span>
              </a-space>

            </div>
          </div>
          <div style="position:absolute;bottom: 0px;right: 0px;">
            <a-button id="confirm-Group" v-if="keys.length > 0" @click="openGroupNameModal()">确定</a-button>
            <a-button id="cancel-Group">取消</a-button>
          </div>
        </a-col>
      </a-row>
    </a-modal>
    <!--设置群聊名称-->
    <a-modal v-model="groupNameModal" :footer="null" centered >
      <div>
        <span>请输入群名称</span>
        <a-input style="margin-top: 7px"></a-input>
      </div>
      <div style="margin-top:7px">
        <span>邀请: </span>
        <div style="width: 500px;margin-top: 4px">
          <a-tag color="#108ee9" v-for="friend in keys" style="margin-bottom: 5px">{{ friend.username }}</a-tag>
        </div>
      </div>
      <div style="position:relative;">
        <a-button style="float: right;color: white;background-color: rgb(66, 185, 131)" @click="createGroup()">创建</a-button>
        <a-button style="visibility: hidden">取消</a-button>
      </div>
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
      groupNameModal: false,
      //创建群聊时,选择的用户列表
      keys: [],
      _day: '',
      visible: false,
      addGroupVisible: false,
      //添加好友时,返回的用户列表
      userList: [],
      //好友列表
      friendList: [],
      userSearch: '',
      searchList: [],
      search: '',
      action: 1,
      //当前会话列表
      sessionList: [],
      //群聊会话列表
      groupList: []
    }
  },
  created() {
    this.sessionList = []
    this.friendList = []
    this._day = dayjs
    let lcid = this.$store.getters.getInfo.lcid
    this.queryFriends()
    ipcRenderer.on('friendsInfo',((event, args) => {
      this.friendList = args
      console.log('friendLlist: ',this.friendList)
      this.getOffLine(lcid)
    }))

    eventBus.$on('changeAction',(data) => {
      this.action = data
    })
    eventBus.$on('session',(data) => {
      this.action = 1
      let exist = this.sessionList.some(session => {
          if (session.lcid === data.lcid){
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
      //判断接收到的消息是否在当前会话列表中
      let exist = this.sessionList.some(session => {
        if (session.lcid === message.from){
          session.msgSeq = message.msgSeq
          session.newMsg = message.message
          if (message.msgType === 'IMAGE'){
            session.newMsg = '[ 图片 ]'
          }
          return true
        }
      })
      //如果不在当前会话列表,则看是不是在好友列表中
      if (!exist){
        this.friendList.some(friend => {
          if (friend.userid === message.from){
            friend.msgSeq = message.msgSeq
            friend.newMsg = message.message
            if (message.msgType === 'IMAGE'){
              friend.newMsg = '[ 图片 ]'
            }
            this.sessionList.unshift(friend)
          }
        })
      }
      //排序，让最新的在第一个
      this.sessionList.sort((session_1,session_2) => {
        return session_2.msgSeq-session_1.msgSeq
      })
    })
  },
  methods: {
    //创建群聊
    createGroup(){
      //todo 调用API保存群聊信息

      //todo 创建成功,切换到群聊会话tab,生成会话框
      this.action = 3
    },
    //打开设置群聊名称的Modal
    openGroupNameModal(){
      this.groupNameModal = true
    },
    //获取创建群聊时,点击的用户
    getIndex(index){
      if(this.keys.includes(index)){
        //includes()方法判断是否包含某一元素,返回true或false表示是否包含元素，对NaN一样有效
        //filter()方法用于把Array的某些元素过滤掉，filter()把传入的函数依次作用于每个元素，然后根据返回值是true还是false决定保留还是丢弃该元素：生成新的数组
        this.keys=this.keys.filter((ele) => ele !== index);
      }else{
        this.keys.push(index);
      }
      console.log(this.keys.length)
    },
    removeIndex(index){
      this.keys=this.keys.filter((ele) => ele !== index);
    },
    getOffLine(id) {
      user.offlineMsg(id).then(response => {
        console.log(response.data)
        let list = response.data.data
        for (let i = 0; i < list.length;) {
          let message = JSON.stringify(list[i])
          ipcRenderer.send('downLoadOss',[0,message])
          ipcRenderer.on('OffLineDataUrl', ((event,arg) => {
            list[i].message =  arg.toString()
            let result = ipcRenderer.sendSync('saveChat',JSON.stringify(list[i]))
            if (result === 'done'){
              i++
            }
          }))
        }
        this.getSessionList(id)
      })
    },
    getSessionList(lcid) {
      ipcRenderer.send('getSessions',lcid)
      ipcRenderer.on('sessionsCallBack',((event, args) => {
        this.setSessionList(args)
      }))
    },
    setSessionList(data){
      console.log(data)
      console.log("list: ",this.friendList)
      for (let i = 0; i < data.length; i++) {
        this.friendList.some(friend => {
          if (friend.lcid === data[i].lcid){
            friend.msgSeq = data[i].msgSeq
            friend.newMsg = data[i].message
            if (data[i].msgType === 'IMAGE'){
              friend.newMsg = '[ 图片 ]'
            }
            this.sessionList.unshift(friend)
            //排序，让最新的在第一个
            if (this.sessionList.length > 1){
              this.sessionList.sort((session_1,session_2) => {
                return session_2.msgSeq-session_1.msgSeq
              })
            }
          }
        })
      }
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
    queryFriends(){
      let currentId = this.$store.getters.getInfo.lcid
      console.log("currentId: ",currentId)
      const friends = [];
      friend.getFriends(currentId).then(response => {
        let data = response.data.data
        console.log('queryFriends: ',data)
        for (let i = 0; i<data.length; i++){
          let friend = [data[i].lcid,data[i].userName,data[i].avatar,data[i].background,data[i].description]
          friends.push(friend)
        }
        //这里可以优化,获取最小好友列表后，更新即可，不需要再queryFriend
        ipcRenderer.send('updateFriend',friends)
        ipcRenderer.send('queryFriend','')
      })
    },
    //聊天
    toChat(val){
      eventBus.$emit('click', val)
    },
    toInfo(val){
      eventBus.$emit('toInfo', val)
    },
    addFriend(lcid){
      let currentId = this.$store.getters.getInfo.lcid
      let data = {'userId':currentId,'friendId':lcid}
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
      let key =  this.userSearch.trim()
      if (key.length === 0){
        this.userList = []
      }
      if (key.length > 0){
        user.search(this.userSearch).then((response) => {
          if (response.data.code === 200){
            this.userList = response.data.data
          }
        })
      }
    },
    handleMenuClick(e) {
      if (e.key === 'addUser'){
        this.visible = true
      }else{
        this.addGroupVisible = true
      }
    }
  },

}
</script>

<style scoped>
.chat-list{
  overflow-y: hidden;
}
.chat-list:hover{
  overflow-y: auto;
}
#confirm-Group{
  margin-right: 5px;
  background-color: #42b983;
  color: white;
}
.group-Li{
  width: 80%;
  border-radius: 7px;
  cursor: pointer;
  -webkit-user-select:none;
  -moz-user-select:none;
  -ms-user-select:none;
  user-select:none;
}
.group-Li:hover{
  background-color: rgb(232, 231, 231);
}
.click-Group-Li{
  border-radius: 7px;
  width: 80%;
  margin-top: 7px;
  border: 1px solid rgb(26, 173, 25);
}
.selectUser-Group-Li{
  padding: 7px;
  width: 80%;
  margin: 0 auto;
  cursor: pointer;
  -webkit-user-select:none;
  -moz-user-select:none;
  -ms-user-select:none;
  user-select:none;
}
</style>