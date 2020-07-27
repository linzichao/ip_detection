# Node.js + Redis requests traffic monitoring based on IP

## How to use
Send a GET request to [http://140.119.19.117:3000/](http://140.119.19.117:3000/)

## Set up at your local
start the Redis server
```
$ redis-server
```

install the packages
```
$ npm install
```

start the monitoring server
```
$ npm start
```

Now you can access the server by
[http://localhost:3000](http://localhost:3000)

## Why Redis
In this project, we have to handle the request within one minute. Thus, the efficiency of the transactions must be high. And Redis is in-memory data structure store, used as a database or cache. Because of manipulating data in-memory, using Redis is a nice choice in the storage of the attributes of requests.

## How to test
```
$ npm test
```