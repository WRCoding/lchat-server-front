<template>
  <div>
    <a-row type="flex">
      <chat-side></chat-side>
      <chat-list></chat-list>
      <chat-area></chat-area>
    </a-row>
  </div>
</template>

<script>
import chatList from  '../components/ChatList'
import chatArea from  '../components/ChatArea'
import chatSide from  '../components/ChatSide'

export default {
  components: {
    chatList,
    chatArea,
    chatSide
  },
  name: "Index"
}
</script>

<style scoped>
.ant-popover-placement-leftTop > .ant-popover-content > .ant-popover-inner {
  background-color: rgb(152, 225, 101);
}

.ant-popover-placement-leftTop > .ant-popover-content > .ant-popover-arrow {
  background-color: rgb(152, 225, 101);
  border-style: none;
}

</style>