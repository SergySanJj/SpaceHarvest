const path = require("path");
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');
const connect = require('connect');
const cors = require('cors');
const fetch = require('node-fetch');
const relativeURL = require('./urlmod').relativeURL;

const app = express();
app.use(express.static(path.join(__dirname, '/dist')));

const port = process.env.PORT || 3000;
const server = http.createServer(app);
const io = socketIo.listen(server);

const distFolder = path.join(__dirname, '..', '/dist/spacegame');


server.listen(port, () => {
  console.log("Server started on", port);
});

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/*.(css|js|ico|html)', (req, res) => {
  let p = path.join(distFolder, req.url);
  if (fs.existsSync(p)) {
    res.sendFile(p);
  } else {
    res.sendFile(path.join(distFolder, '/index.html'));
  }
});

app.get('/api/*', (req, res) => {
  console.log('api call');
  const firebase = 'https://firebasestorage.googleapis.com/';
  const reqUrl = relativeURL('api/', req.url);
  console.log('req url', reqUrl);
  const firebaseFile = firebase + reqUrl;
  console.log('actual firebase', firebaseFile);
  fetch(firebaseFile)
    .then(res => res.buffer())
    .then(buffer => res.send(buffer));
});

app.get('/*', (req, res) => {
  res.sendFile(path.join(distFolder, '/index.html'));
});


const messages = [];
const sockets = [];


io.sockets.on('connection', function (socket) {
  console.log(`user ${socket.handshake.address} connected`);
  sockets.push(socket);

  socket.on('message', function (data) {
    if (data !== '' && data !== null) {
      let newMsg = `${socket.handshake.address}: ${data}`;
      messages.push(newMsg);
      if (data.charAt(0) === '/') {
        console.log('Admin command request from ', socket.handshake.address, data);
        let cmd = data.substring(1, data.length);
        try {
          updateSingle(newMsg, socket);
          let cmdRes = eval(cmd);
          serverMessage(JSON.stringify(cmdRes), socket);
        } catch (e) {
          console.log('Error during admin command execution');
          serverMessage("Error during command execution", socket);
        }
      } else {
        updateAll(newMsg)
      }
    }
  });
  socket.on('disconnect', function () {
    console.log(`user ${socket.handshake.address} disconnected`);
  });
});

function updateAll(newMsg) {
  for (let socket of sockets) {
    socket.emit('message', newMsg)
  }
}

function updateSingle(newMsg, socket) {
  socket.emit('message', newMsg)
}

function updateGroup(newMsg, socketArray) {
  for (let socket of socketArray) {
    socket.emit('message', newMsg)
  }
}

function serverMessage(newMsg, socket) {
  socket.emit('serverMessage', newMsg)
}

// Admin commands
function getCurrentUsers() {
  let res = [];
  for (let s of sockets) {
    res.push(s.handshake.address);
  }
  return res;
}


