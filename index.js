const express = require('express');
const e = require('express');
const app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var Gpio = require('onoff').Gpio;

var relay = new Gpio(4, 'out');

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname+'/index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('pump', (pumpState) => {
    console.log('message: ' + pumpState.status);
    if (pumpState.status === 'on')
      relay.writeSync(0);
    else if (pumpState.status === 'off')
      relay.writeSync(1);
  });
});

http.listen(3005, () => {
  console.log('listening on *:3005');
});
// app.listen(3005, () => console.log('start 3005'));