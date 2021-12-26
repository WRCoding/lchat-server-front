<template>
  <div>
    <div class="chat-list-card" @click="toGroupChat(item)" style="width: 300px;background-color: rgb(232, 231, 230);padding: 10px 5px;display: flex;align-items: center" v-for="item in groupList">
      <a-space align="center" style="width: 100%;display: flex">
        <a-badge><a-avatar style="backgroundColor:rgb(24, 144, 255)" :size="45" shape="square">Group</a-avatar></a-badge>
        <a-space direction="vertical" style="margin-left: 7px;flex-grow: 1">
          <a-space><span><b style="font-size: 14px">{{item.group_name}}</b></span><span style="margin-right: auto;font-size: 10px">{{'2021-12-11 16:35'}}</span></a-space>
          <span>{{'收到'}}</span>
        </a-space>
      </a-space>
    </div>
  </div>
</template>
<script>
import { ipcRenderer } from 'electron'
export default {
  name: "Group",
  props:{
    groupList:{
      type: [],
      default: () => {return [
      ]}
    }
  },
  created() {
    console.log('我被创建啦！！')
    //todo 获取当前的群聊会话列表,按时间排序
    this.init()
  },
  destroyed() {
    console.log('我被销毁啦！！')
  },
  methods:{
    init(){

    },
    toGroupChat(data){
      this.$emit('toGroupChat',data)
    }
  }
}
</script>

<style scoped>

</style>