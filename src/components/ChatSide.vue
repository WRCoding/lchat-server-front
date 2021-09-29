<template>
    <a-col flex="64px" style="background-color: rgb(46, 46, 46)">
      <a-space direction="vertical" align="center">
        <a-avatar shape="square" :size="40" :src="userInfo.avatar"
                  style="margin-top: 30px;margin-left: 10px" @click="showUserInfo()"/>
        <a-icon type="message" class="action-side" v-bind:class="{'action-click': changeAction === 1,'action-former': changeAction !==1}" @click="actionChange(1)"/>
        <a-icon type="user" class="action-side" v-bind:class="{'action-click': changeAction === 2,'action-former': changeAction !==2}" @click="actionChange(2)"/>
      </a-space>
      <!--个人信息-->
      <a-drawer
          placement="right"
          :closable="false"
          :visible="visible"
          @close="onClose"
      >
        <template slot="title">
          <span><b>个人信息</b></span>
          <span class="logoutBtn" @click="logout()"><a-icon type="logout"/>退出登录</span>
        </template>
        <a-card hoverable style="width: 100%;">
          <img
              slot="cover"
              alt="example"
              :src="userInfo.background"
              height="200px"
              width="200px"
              @click="showModal('backGround')"
          />
          <a-card-meta>
            <template slot="title">
              <span v-if="!isEditName" @click="getEditName()">{{ userInfo.userName }}</span>
              <span v-if="isEditName"><a-input
                  v-model="name"
                  placeholder=""
                  :max-length="25"
                  v-if="isEditName"
                  auto-focus
                  @pressEnter="removeEditName()"
              /></span>
            </template>
            <template slot="description">
              <span v-if="userInfo.description == null && !isEditDesc" style="color: rgb(165, 194, 97)"
                    @click="getEdit()">编辑个性签名</span>
              <a-tooltip :trigger="['focus']" placement="topLeft" overlay-class-name="numeric-input">
                <span v-if="desc" slot="title" class="numeric-input-title">
                  {{ desc }}
                </span>
                <a-input
                    v-model="desc"
                    placeholder="个性签名"
                    :max-length="25"
                    v-if="isEditDesc"
                    auto-focus
                    @pressEnter="removeEdit()"
                />
              </a-tooltip>
              <!--              <span v-if="isEditDesc" @change="removeEdit()"><a-input placeholder="个性签名"/></span>-->
              <span v-if="userInfo.description != null && !isEditDesc"
                    @click="getEdit()">{{ userInfo.description }}</span>
            </template>
            <a-avatar
                slot="avatar"
                :src="userInfo.avatar"
                @click="showModal('avatar')"
            />
          </a-card-meta>
        </a-card>
        <a-result>
          <template slot="title">
            <span>你已经加入{{ userInfo.days }}天</span>
          </template>
          <template #icon>
            <a-icon type="smile" theme="twoTone"/>
          </template>
          <template #extra>
          </template>
        </a-result>
      </a-drawer>
      <a-modal v-model="openModel" :title="modalTitle" :footer="null">
        <a-tooltip placement="left">
          <template slot="title">
            <span>点击上传{{ flag ? '背景图' : '头像' }}</span>
          </template>
          <div class="modal-div">
            <a-input type="file" id="upload" style="display:none;" accept="image/gif,image/jpeg,image/png,image/jpg"
                     @change="freshImg"/>
            <img
                :class="{'modal-background' : flag,'modal-avatar' : !flag}"
                alt="example"
                :src="imageUrl"
                height="100%"
                width="100%"
                @click="openFile()"
            />
          </div>
        </a-tooltip>
      </a-modal>
    </a-col>
</template>

<script>
import {eventBus} from '../main'
import user from "../js/user";
import {ipcRenderer} from "electron";
export default {
  name: "chat-side",
  data(){
    return{
      visible: false,
      isEditName: false,
      isEditDesc: false,
      desc: '',
      name: '',
      modalTitle: '',
      openModel: false,
      flag: true, //判断modal的圆角是background还是avatar,true为background
      imageUrl: '',
      userInfo: {},
      changeAction: 0,
    }
  },
  created() {
    this.userInfo = this.$store.getters.getInfo
  },
  methods: {
    actionChange(val){
      console.log(val)
      this.changeAction = val
      eventBus.$emit('changeAction', this.changeAction)
    },
    showUserInfo() {
      console.log(this.$store.state.userInfo)
      this.userInfo = this.$store.state.userInfo
      this.visible = true
    },

    freshImg(e) {
      let _this = this;
      _this.imgObj = e.target.files['0'];               //得到上传的第一个文件
      console.log(e.target.files['0'])
      let fr = new FileReader();                        //异步读取存储在用户计算机上的文件（或原始数据缓冲区）的内容
      fr.onload = function () {
        _this.imageUrl = fr.result;                       // 图片文件赋值给图片标签路径
      }
      fr.readAsDataURL(_this.imgObj);                   //将读取到的文件编码成Data URL
      let formData = new FormData()
      formData.append('file', _this.imgObj)
      formData.append('userId', this.$store.getters.getInfo.id)
      formData.append('flag', this.flag)
      user.uploadFile(formData).then(response => {
        let result = response.data
        if (result.code === 200) {
          this.userInfo = result.data
          this.$store.commit('setInfo', this.userInfo)
        }
      })
    },
    openFile() {
      document.getElementById('upload').click()
    },
    showModal(flag) {
      console.log(flag)
      if (flag === 'backGround') {
        this.imageUrl = this.userInfo.background
        this.modalTitle = '上传背景图'
        this.flag = true
      } else if (flag === 'avatar') {
        this.imageUrl = this.userInfo.avatar
        this.modalTitle = '上传头像'
        this.flag = false
      }
      this.openModel = true
    },
    updateInfo() {
      user.save(this.userInfo).then(response => {
        let result = response.data
        if (result.code === 200) {
          this.$message.success('更新成功');
          console.log(this.$store.getters.getInfo)
        }
      })
    },
    removeEdit() {
      this.isEditDesc = false;
      if (this.desc !== this.userInfo.description) {
        this.userInfo.description = this.desc
        this.updateInfo()
      }
      this.desc = ''
    },
    getEdit() {
      this.desc = this.userInfo.description
      this.isEditDesc = true;
    },
    removeEditName() {
      this.isEditName = false;
      if (this.name !== this.userInfo.userName) {
        this.userInfo.userName = this.name
        this.updateInfo()
      }
      this.name = ''
    },
    getEditName() {
      this.name = this.userInfo.userName
      this.isEditName = true
    },
    logout() {
      ipcRenderer.send('logout', this.userInfo.id)
      ipcRenderer.on('successLogout', (() => {
        this.$router.push('/')
        this.$store.commit('deleteInfo')
      }))
    },
    onClose() {
      this.visible = false;
      this.isEditDesc = false;
      this.isEditName = false
    },
  }
}
</script>

<style scoped>
.modal-div {
  width: 200px;
  height: 200px;
  margin: 0 auto;
}

.modal-avatar {
  border-radius: 50%;
  cursor: pointer;
}

.modal-background {
  border-radius: 10%;
  cursor: pointer;
}
.logoutBtn {
  cursor: pointer;
  margin-left: 24%;
  color: rgb(255, 77, 79)
}
.action-side{
  cursor: pointer;
  font-size: 25px;
  margin-top: 17px
}
.action-side:hover{
  color: rgb(7, 193, 96) ;
}
.action-click{
  color: rgb(7, 193, 96);
}
.action-former{
  color: rgb(144, 144, 144);
}
</style>