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
                  <a-menu-item key="addGroup"><a-icon type="usergroup-add" />创建群聊</a-menu-item>
                </a-menu>
                <a-button size="small" style="background-color: rgb(226, 226, 226);margin-left: 10px" icon="plus"/>
              </a-dropdown>
            </span>
      </a-col>
      <a-col class="chat-list" style="background-color: rgb(228, 228, 229);max-height: 650px;display: block;cursor: pointer">
        <div v-if="search.length === 0" class="chat-list-card" @click="toChat()" style="width: 300px;background-color: rgb(232, 231, 230);padding: 10px 5px" v-for="item in 19">
          <a-space align="center">
            <a-badge :count="77"><a-avatar :size="45" shape="square" src="https://lchat-server.oss-cn-shenzhen.aliyuncs.com/avatar/default/avatar.jpg" /></a-badge>
            <a-space direction="vertical" style="margin-left: 7px">
              <a-space><span><b style="font-size: 14px">Block</b></span><span style="float: left;font-size: 10px">21/9/11</span></a-space>
              <span>哈哈哈哈{{item}}</span>
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
            <a slot="actions"><a-icon type="user-add" /></a>
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
import user from '../js/user'
export default {
  name: "chat-list",
  data() {
    return {
      visible: false,
      userList: [],
      userSearch: '',
      chatList: [
        {
          name: '林北',
          time: '21/9/12',
          desc: '哈哈哈哈Electron',
          avatar: 'https://lpepsi.oss-cn-shenzhen.aliyuncs.com/avatar.jpg'
        }
      ],
      searchList: [
        {
          name: '林北',
          time: '21/9/12',
          desc: '哈哈哈哈Electron',
          avatar: 'https://lpepsi.oss-cn-shenzhen.aliyuncs.com/avatar.jpg'
        },
        {
          name: '林北',
          time: '21/9/12',
          desc: '哈哈哈哈Electron',
          avatar: 'https://lpepsi.oss-cn-shenzhen.aliyuncs.com/avatar.jpg'
        },
        {
          name: '林北',
          time: '21/9/12',
          desc: '哈哈哈哈Electron',
          avatar: 'https://lpepsi.oss-cn-shenzhen.aliyuncs.com/avatar.jpg'
        }
      ],
      search: ''
    }
  },
  watch:{
    userSearch(val,oldVal){

    }
  },
  methods: {
    toChat(){
      eventBus.$emit('click', '妈妈说，该做作业了！(^_^)!!!')
    },
    getCurrentList() {
      let db = this.$store.getters.getDB
      let sql = 'create table if not exists lchat_list()'
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