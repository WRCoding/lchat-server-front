module.exports = {
    pluginOptions: {
        electronBuilder: {
            nodeIntegration: true,
            contextIsolation: false
        }
    },
    devServer: {
        port: 8527,
        proxy:{//开发环境代理配置
            '/chat':{
                //目标服务器地址
                target: 'http://localhost:8077/',
                changeOrigin: true, //开启代理服务器
                pathRewrite: {
                    '^/chat': ''//将/api 替换为空的 如：/api/xxx 最终会发送 target/xxx
                }
            }
        }
    },
    lintOnSave: false,
    productionSourceMap: false
}