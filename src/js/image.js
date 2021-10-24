
const fs = require('fs');
const OSS = require('ali-oss')
const path = require("path")
const nativeImage = require('electron').nativeImage
let client = new OSS({
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
        let success = false
        const result = client.put('lchatimage/'+imageFileName, dataBuffer);
        success = result.then((data) => {
            console.log(data)
            let status = data.res.status
            if (status === 200){
                success = true
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
                return success
            }
        })
        return  success;
    },
    downloadImage(filename){
        try {
            fs.mkdir('receiveImage',{ recursive: true }, (err) => {
                if (err) throw err;
            });
            let path = 'receiveImage\\' + filename.split('/')[1]
            // 填写Object完整路径和本地文件的完整路径。Object完整路径中不能包含Bucket名称。
            // 如果指定的本地文件存在会覆盖，不存在则新建。
            // 如果未指定本地路径，则下载后的文件默认保存到示例程序所属项目对应本地路径中。
            return client.get(filename, path)
        } catch (e) {
            console.log(e);
        }
    },
    parseToDataUrl(parseData){
        let parseDataArray = parseData.split('_')
        // let width = parseDataArray[0]
        // console.log('width: ',width)
        // let height = parseDataArray[1]
        // console.log('height: ',height)
        let dataUrl = parseDataArray[2]
        let image = nativeImage.createFromDataURL(dataUrl)
        let width = image.getSize().width
        let height = image.getSize().height
        width = parseDataArray[0]
        height = parseDataArray[1]
        let resizeImage = image.resize({width:width,height:height,quality: 'better'})
        console.log(resizeImage.getSize())
        return resizeImage.toDataURL()
    }
}