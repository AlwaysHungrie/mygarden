const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// var io = require('socket.io')(http);
var Gpio = require('onoff').Gpio;
var relay = new Gpio(4, 'out');
relay.writeSync(1);

let pumpTimer;
let pumpActive = false;

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname+'/index.html');
});

app.get('/waterLevel', (req, res) => {
  fs.readFile('waterlevel', function(err, data) {
    if (err) throw err;
    res.json({'waterLevel': data});
  });
});

app.get('/status', (req, res) => {
  res.json({'status': pumpActive});
})

app.post('/start', (req, res) => {
  console.log('starting pump')
  pumpActive = true;
  relay.writeSync(0);

  res.json({'status': 'done'});

  pumpTimer = setTimeout(() => {
    console.log('stopping pump')
    pumpActive = false;
    relay.writeSync(1);
    
  },10000);
});

app.post('/stop', (req, res) => {
  // console.log('stop')
  // console.log(req);
  fs.writeFile('waterlevel', req.body.waterLevel , function(err) {
    if (err) throw err;
  });

  relay.writeSync(1);
  pumpActive = false;

  res.json({'status': 'done'});
  clearTimeout(pumpTimer);
});

app.listen(3005, () => console.log('start 3005'));
