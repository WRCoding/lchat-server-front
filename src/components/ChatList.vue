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
                  <a-menu-item key="addGroup"> <a-icon type="user"/>创建群聊</a-menu-item>
                </a-menu>
                <a-button size="small" style="background-color: rgb(226, 226, 226);margin-left: 10px" icon="plus"/>
              </a-dropdown>
            </span>
      </a-col>
      <a-col style="background-color: rgb(228, 228, 229);height: 800px;display: block;">
        <div v-if="search.length === 0"  style="width: 300px;background-color: rgb(232, 231, 230);margin-bottom: 7px" v-for="item in chatList">
          <a-space align="center">
            center
            <a-button type="primary">Primary</a-button>
            <span class="mock-block">Block</span>
          </a-space>
        </div>
        <!-- 搜索用户时的列表-->
        <a-card v-if="search.length > 0">
          <a-card hoverable style="width: 300px;background-color: rgb(232, 231, 230);margin-top: 7px" v-for="item in searchList">
            <div style="margin: 7px 7px">
              <span>
                <a-avatar :size="50" shape="square" slot="avatar" :src=item.avatar />
              </span>
              <span style="margin-left: 10px;font-size: 17px">
                {{item.name}}
              </span>
            </div>
          </a-card>
        </a-card>
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
  methods: {
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

</style>