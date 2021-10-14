
const fs = require('fs');
const OSS = require('ali-oss')
const path = require("path")

const client = new OSS({
    // yourregion填写Bucket所在地域。以华东1（杭州）为例，Region填写为oss-cn-hangzhou。
    region: 'oss-cn-shenzhen',
    // 阿里云账号AccessKey拥有所有API的访问权限，风险很高。强烈建议您创建并使用RAM用户进行API访问或日常运维，请登录RAM控制台创建RAM用户。
    accessKeyId: 'LTAI5tNZL22f5adNW1D5Fnq8',
    accessKeySecret: 'BV1RqiggdmXcROb06G1hRMKHu8yGeM',
    // 填写Bucket名称。
    bucket: 'lchat-server',
});
export default {
    imageToFile(data,filename){
        const dataBuffer = new Buffer(data, 'base64'); //把base64码转成buffer对象，
        let folder = 'chatimage'
        let imageFileName = filename + '.png'
        let imageFilePath = folder + '/' + imageFileName
        fs.mkdir(folder,{ recursive: true }, (err) => {
            if (err) throw err;
        });
        fs.writeFile(imageFilePath, dataBuffer, function(err){//用fs写入文件
            if(err){
                console.log(err);
            }else{
                console.log('写入成功！');
            }

        })
        client.put('lchatimage/'+imageFileName, dataBuffer);
        return {imageFileName, imageFilePath}
    },

}