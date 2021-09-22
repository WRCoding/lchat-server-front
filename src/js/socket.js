const net = require('net');

const tcp = tcp || {};

tcp.client = function (){
    tcp.socket = net.createConnection({
        host: '127.0.0.1',
        port: 7777
    });
    tcp.socket.on('connect', () => {
        // 向服务器发送数据
        tcp.socket.write('Nodejs 技术栈\n');

        setTimeout(() => {
            tcp.socket.write('JavaScript\n');
            tcp.socket.write('TypeScript\n');
            tcp.socket.write('Python\n');
            tcp.socket.write('Java\n');
            tcp.socket.write('C\n');
            tcp.socket.write('PHP\n');
            tcp.socket.write('ASP.NET\n');
        }, 1000);
    })
    tcp.socket.on('data', buffer => {
        console.log(buffer.toString());
    });
}
// tcp.client.prototype.write = function (message){
//     console.log('正在发送数据： ',message)
//     tcp.socket.write(message,(err => {
//
//     }))
// }
exports.Socket = tcp.client