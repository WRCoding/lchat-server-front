<template>
  <div style="display: flex;align-items: center;justify-content: center">
    <div style="margin-left: 20px">
      <img src="../assets/chat.png" alt="" style="width: 200px;height: 200px;" >
    </div>
    <div style="display: inline-block;margin-left: 20px">
      <h1 style="margin-left: 30%">L-chat</h1>
      <a-input ref="userNameInput" v-model="userName" placeholder="请输入账号" style="width: 200px;"></a-input>
      <a-input placeholder="请输入密码" v-model="password" :visibilityToggle="false" style="margin-top: 7px;width: 200px">
        <a-icon slot="suffix" type="right-circle"  @click="login()"/>
      </a-input>
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
import {sqliteDB} from '../js/db'
import user from '../js/user'
import net from "net";
export default {
  name: "Login",
  data(){
    return{
      userName: 'xw',
      password: '1234'
    }
  },
  methods:{
    login(){
      const userName = this.userName;
      const password = this.password;
      console.log({userName,password})
      user.login({userName,password}).then(response => {
        let result = response.data
        if (result.code === 200){
          let userInfo = result.data
          this.$store.commit('setInfo',userInfo)
          this.createDB(userInfo)
          this.clearInput()
          const data = {'msgSeq': new Date().getTime(), 'from': userInfo.id, 'to': 'server','message':'', 'msgType': 'INIT'};
          ipcRenderer.send('login',JSON.stringify(data))
          ipcRenderer.on('success',((event,arg) => {
            this.$router.push('/index')
          }))
        }else{
          this.$message.error(result.message);
          this.clearInput()
        }
      })

    },
    clearInput(){
      this.userName = ''
      this.password = ''
    },
    createDB(userInfo) {
      let dbFile = userInfo.userName + '.db'
      let db = new sqliteDB(dbFile)
      let sql = `
            CREATE TABLE IF NOT EXISTS "lchat_friend" (
              "userid" text NOT NULL,
              "username" blob,
              "avatar" text,
              "background" text,
              "description" text,
              PRIMARY KEY ("userid")
            );
      `
      db.createTable(sql)
      this.$store.commit('setDB',db)
    }
  }
}
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 10px;
  margin-top: 17px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>