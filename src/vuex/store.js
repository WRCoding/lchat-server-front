import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
    count: 1,
    userInfo:{},
    db:{},
    socket: null
}
const getters = {
    getCount(state){
        return state.count
    },
    getInfo(state){
        return state.userInfo
    },
    getDB(state){
        return state.db
    },
    getSocket(state){
        return state.socket
    }
}
const mutations = {
    setCount(state,count){
        state.count = count
    },
    setInfo(state,userInfo){
        state.userInfo = userInfo
    },
    setDB(state,db){
        state.db = db
    },
    setSocket(state,socket){
        this.state.socket = socket
    },
    deleteInfo(state){
        state.userInfo = {}
    }
}

export default new Vuex.Store({
    state,
    getters,
    mutations
})