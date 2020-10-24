const waterButton = document.querySelector('.water-button');
const icon = document.querySelector('.water-icon');
const shadow = document.querySelector('.water-shadow');
const contents = document.querySelector('.water-container-contents');

// const socket = io();
let emitInterval;
let waterLevel = 0;

waterButton.addEventListener('mousedown', () => {
  icon.classList.add('water-icon-active');
  shadow.classList.add('water-shadow-active');

  fetch('/start', {
    method: 'POST',
    body: JSON.stringify({
      'command': 'start'
    })
  });

  emitInterval = setInterval(() => {
    waterLevel += 0.25;
    
    if (waterLevel === 100) {
      // socket.emit('pump', {'status': 'off'});
      fetch('/stop', {
        method: 'POST',
        body: JSON.stringify({
          'command': 'stop'
        })
      });
    }
    contents.style.transform = `translateY(${waterLevel}%)`;
  }, 100);
});

// waterButton.addEventListener('touchstart', () => {
//   icon.classList.add('water-icon-active');
//   shadow.classList.add('water-shadow-active');

  
//   emitInterval = setInterval(() => {
//     socket.emit('pump', {'status': 'on'});

//     waterLevel += 0.25;
//     if (waterLevel > 100) {
//       socket.emit('pump', {'status': 'off'});
//     }
//     contents.style.transform = `translateY(${waterLevel}%)`;
//   }, 100);  
// });

// waterButton.addEventListener('touchend', () => {
//   icon.classList.remove('water-icon-active');
//   shadow.classList.remove('water-shadow-active');

//   if (emitInterval) {
//     socket.emit('pump', {'status': 'off'});
//     clearInterval(emitInterval);
//   }
// });

// waterButton.addEventListener('touchcancel', () => {
//   icon.classList.remove('water-icon-active');
//   shadow.classList.remove('water-shadow-active');

//   if (emitInterval) {
//     socket.emit('pump', {'status': 'off'});
//     clearInterval(emitInterval);
//   }
// });

waterButton.addEventListener('mouseup', () => {
  icon.classList.remove('water-icon-active');
  shadow.classList.remove('water-shadow-active');

  if (emitInterval) {
    fetch('/stop', {
      method: 'POST',
      body: JSON.stringify({
        'command': 'stop'
      })
    });
    
    clearInterval(emitInterval);
    emitInterval = null;
  }
});

// waterButton.addEventListener('mouseleave', () => {
//   icon.classList.remove('water-icon-active');
//   shadow.classList.remove('water-shadow-active');
//   console.log(emitInterval)
//   if (emitInterval) {
//     fetch('/stop', {
//       method: 'POST',
//       body: JSON.stringify({
//         'command': 'stop'
//       })
//     });

//     clearInterval(emitInterval);
//     emitInterval = null;
//   }
// });