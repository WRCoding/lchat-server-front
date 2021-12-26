import request from '../util/Request'

export default {
    save(data){
        return request({
            url: '/group/save',
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            data: data
        })
    },
    members(groupId){
        return request({
            url: '/group/members/'+groupId,
            method: 'get'
        })
    },
    groupInfo(lcid){
        return request({
            url: '/group/groupInfo/'+lcid,
            method: 'get'
        })
    },
}