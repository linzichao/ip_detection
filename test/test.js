var server = require('../lib/server');
var assert = require('assert');
var http = require('http');

describe('#server', () => {
  before(() => {
    server.listen(3000);
  });

  it('should return 200', (done) => {
    http.get('http://localhost:3000', (res) => {
      assert.equal(200, res.statusCode);
      done();
    });
  });

  it('should count not less than 1 or return Error', (done) => {
    (http.get('http://localhost:3000', (res) => {
      var data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        data = JSON.parse(data);
        if (data.counter !== 'Error' && !Number(data.counter) > 0)
          assert.fail('Counter should over 1 or return Error!');
        done();
      });
    }));
  });

  it('should return error', (done) => {    
    var get_request = function(i){
      if(i < 60) {
        http.get('http://localhost:3000', function(res) {
          var data = '';
          res.on('data', (chunk) => {
            data += chunk;
          });
          res.on('end', () => {
            data = JSON.parse(data);
            if(i == 59 && data.counter === 'Error')
              done();
          });       
          get_request(i+1);
        });
      }
    };
    get_request(0);
  });

  after(() => {
    server.close();
  });
});