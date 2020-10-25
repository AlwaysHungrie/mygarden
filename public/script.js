const waterButton = document.querySelector('.water-button');
const icon = document.querySelector('.water-icon');
const shadow = document.querySelector('.water-shadow');
const contents = document.querySelector('.water-container-contents');

waterButton.oncontextmenu = function(event) {
  event.preventDefault();
  event.stopPropagation(); // not necessary in my case, could leave in case stopImmediateProp isn't available? 
  event.stopImmediatePropagation();
  return false;
};

icon.oncontextmenu = function(event) {
  event.preventDefault();
  event.stopPropagation(); // not necessary in my case, could leave in case stopImmediateProp isn't available? 
  event.stopImmediatePropagation();
  return false;
};

shadow.oncontextmenu = function(event) {
  event.preventDefault();
  event.stopPropagation(); // not necessary in my case, could leave in case stopImmediateProp isn't available? 
  event.stopImmediatePropagation();
  return false;
};

fetch('/waterLevel', {
  method: 'GET',
}).then(response => response.json()).then(data => {
  
  console.log(data.waterLevel);
  let waterLevel = parseInt(data.waterLevel);
  contents.style.transform =  `translateY(${waterLevel}%)`;

  let emitInterval;
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

  waterButton.addEventListener('touchstart', () => {
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
        waterButton.removeEventListener('touchend', stopFlow);
        hardStop = true;
      }
      contents.style.transform = `translateY(${waterLevel}%)`;

      fetch('/status', {
        method: 'GET',
      }).then(response => response.json()).then(data => {
        if (data.status == false && buttonActive == true) {
          stopFlow();
          waterButton.removeEventListener('touchend', stopFlow);
        }
      });
    }, 100);

    waterButton.addEventListener('touchend', stopFlow);
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

  waterButton.addEventListener('touchcancel', () => {
    if (buttonActive) {
      stopFlow();
    }
    waterButton.removeEventListener('touchend', stopFlow);
  });
});
