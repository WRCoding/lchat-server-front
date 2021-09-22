import request from '../util/Request'

export default {
    login(data){
        return request({
            url: '/user/login',
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            data: data
        })
    },
    save(data){
        return request({
            url: '/user/save',
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            data: data
        })
    },
    uploadFile(data){
        return request({
            url: '/user/uploadFile',
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            data: data
        })
    },
    search(data){
        return request({
            url: '/user/search?key='+data,
            method: 'get'
        })
    }
}