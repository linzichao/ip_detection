const http = require('http');
const url = require('url');
const request = require('request');
const redis = require('redis');
const client = redis.createClient();

client.on('error', (error) => {
  console.error(error);
});

this.server = http.createServer((req, res) => {
    if (req.url == "/") { 
        let ip = (req.headers["x-forwarded-for"] || "").split(",").pop() ||
                    req.connection.remoteAddress ||
                    req.socket.remoteAddress ||
                    req.connection.socket.remoteAddress;

        var log_information = {'ip': ip};

        client.hgetall(ip, (err, value) => {
            if (err) throw err;
            
            var redis_action = new Promise((resolve, reject) => {
                if (value === null) {
                    client.hmset(ip, 'counter', '1', 'time', Date.now(), (err, result) => {
                        if (err) throw err;
                        console.log('ip address is: '  + ip + ' and request counter is: 1');
                        log_information['counter'] = 1;
                        resolve();
                    });
                } else {
                    if ((Date.now() - value.time) / 60000 < 1){
                        if (Number(value.counter) >= 60){
                            console.log('ip address is: ' + ip + ' Error!!!');
                            log_information['counter'] = 'Error';
                            resolve();
                        } else {
                            client.hmset(ip, 'counter', Number(value.counter)+1, (err, result) => {
                                if (err) throw err;
                                console.log('ip address is: '  + ip + ' and request counter is: ' + (Number(value.counter) + 1));
                                log_information['counter'] = Number(value.counter) + 1;
                                resolve();
                            }); 
                        }   
                    } else {
                        client.hmset(ip, 'counter', '1', 'time', Date.now(), (err, result) => {
                            if (err) throw err;
                            console.log('ip address is: '  + ip + ' and request counter is: 1');
                            log_information['counter'] = 1;
                            resolve();
                        });
                    }
                }
            });
            
            redis_action.then(() => {
                res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                res.write(JSON.stringify(log_information));
                res.end();
            })
        }); 
    
    }
});

module.exports.listen = ((arguments) => {
    this.server.listen(arguments);
});

module.exports.close = ((callback) => {
    this.server.close(callback);
});