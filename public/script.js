const waterButton = document.querySelector('.water-button');
const icon = document.querySelector('.water-icon');
const shadow = document.querySelector('.water-shadow');
const contents = document.querySelector('.water-container-contents');

let emitInterval;
let waterLevel = 0;
let buttonActive = false;
let hardStop = false;

waterButton.addEventListener('mousedown', () => {
  if (hardStop) return;
  
  console.log('flow activated')
  fetch('/start', {
    method: 'POST',
    body: JSON.stringify({
      'command': 'start'
    })
  });

  buttonActive = true;
  icon.classList.add('water-icon-active');
  shadow.classList.add('water-shadow-active');

  emitInterval = setInterval(() => {
    waterLevel += 0.5;
    if (waterLevel >= 100) {
      stopFlow();
      waterButton.removeEventListener('mouseup', stopFlow);
      hardStop = true;
    }
    contents.style.transform = `translateY(${waterLevel}%)`;

    fetch('/status', {
      method: 'GET',
    }).then(response => response.json()).then(data => {
      if (data.status == false && buttonActive == true) {
        stopFlow();
        waterButton.removeEventListener('mouseup', stopFlow);
      }
    });
  }, 100);

  waterButton.addEventListener('mouseup', stopFlow);
});

function stopFlow () {
  console.log('flow stopped')
  fetch('/stop', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      "command": "stop",
      "waterLevel": waterLevel,
    })
  });

  icon.classList.remove('water-icon-active');
  shadow.classList.remove('water-shadow-active');
  buttonActive = false;
  clearInterval(emitInterval);
}

waterButton.addEventListener('mouseleave', () => {
  if (buttonActive) {
    stopFlow();
  }
  waterButton.removeEventListener('mouseup', stopFlow);
});
