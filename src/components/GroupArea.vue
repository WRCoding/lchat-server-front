<template>
  <div>
    <!--聊天区域-->
    <a-col flex="auto" style="background-color: rgb(245, 245, 245)">
      <a-row>
        <a-col
            style="background-color: rgb(247, 247, 247);height: 50px;display: block;border-bottom: 1px solid rgb(214,214,214)">
          <span style="font-size: 25px;margin-left: 40px"><b>{{ leftUserInfo.username }}</b></span>
        </a-col>
        <a-col>
          <a-row>
            <a-col class="chatArea">
              <a-space direction="vertical" style="width: 100%">
                <div style="margin-top: 4px" v-for="chat in chats">
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
              </a-space>
            </a-col>
            <!--消息发送区域-->
            <a-col style="width: 100%">
              <div>
                <a-icon type="smile" style="font-size: 20px;margin-left: 17px;margin-top: 5px"></a-icon>
                <a-upload :before-upload="beforeUpload" list-type="picture">
                  <a-icon type="folder-open" style="font-size: 20px;margin-left: 10px;margin-top: 5px"></a-icon>
                </a-upload>
              </div>
              <div style="width: 100%">
                <div v-viewer="options" ref="areatext" contenteditable="true" v-model="chat" class="area-text"
                     v-on:keyup.ctrl.86="paste()" @keydown.enter="handleKeyCode($event) ">
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
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </a-col>
  </div>
</template>

<script>
export default {
  name: "GroupArea"
}
</script>

<style scoped>

</style>