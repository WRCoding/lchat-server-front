import request from '../util/Request'

export default {
    addFriend(data){
        return request({
            url: '/friend/addfriend',
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            data: data
        })
    },
    getFriends(data){
        return request({
            url: '/friend/getfriends?id='+data,
            method: 'get'
        })
    }
}