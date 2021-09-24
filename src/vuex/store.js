import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
    userInfo:{},
    db:{}
}
const getters = {
    getInfo(state){
        return state.userInfo
    },
    getDB(state){
        return state.db
    }
}
const mutations = {
    setInfo(state,userInfo){
        state.userInfo = userInfo
    },
    setDB(state,db){
        state.db = db
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