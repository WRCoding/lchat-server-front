
const fs = require('fs');
export default {
    imageToFile(data){
        const dataBuffer = new Buffer(data, 'base64'); //把base64码转成buffer对象，
        fs.writeFile('temp.png', dataBuffer, function(err){//用fs写入文件
            if(err){
                console.log(err);
            }else{
                console.log('写入成功！');
            }

        })
    }

}