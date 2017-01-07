




export default class Mouse {

  constructor(option) {

    this.emitter = option.emitter;
    this.active = true;
    this.mouse = {};
    this.pressAutoEvent = null;

    addMouseListeners(this);
  }

  update() {
    this.state = {
      'mouse' : getMouseStatus(this)
    };
  }
}

function pressAutoEvent(event, self) {

  sendInput(self);
  self.pressAutoEvent = requestAnimationFrame(() => {
    pressAutoEvent(event,self);
  });
}

function addMouseListeners(self) {
  self.mouse = {
    'buttons': {},
    'screenButtons': {},
    'x': -1,
    'y': -1
  };

  var $screen = document.querySelector("video");

  var prevX = 0
    , prevY = 0;



  $screen.addEventListener('contextmenu', function(event) {
    event.preventDefault();
    return false;
  });


  $screen.addEventListener('mousedown', function(event) {

    if (self.active === false) return false;

    var button = event.which;

    if (self.mouse.buttons[button] === undefined) {
      self.mouse.buttons[button] = event.target;
    }

    getMousePointer(event, self);


    if (self.mouse.screenButtons[button] === undefined) {
      self.mouse.screenButtons[button] = true;
    }

    pressAutoEvent(event,self);


    event.preventDefault();
    return false;

  });

  $screen.addEventListener('mouseup', function(event) {

    cancelAnimationFrame(self.pressAutoEvent);

    if (self.active === false) return false;


    var button = event.which;

    if (self.mouse.buttons[button] !== undefined) {
      delete self.mouse.buttons[button];
    }

    getMousePointer(event, self);


    if (self.mouse.screenButtons[button] === true) {
      delete self.mouse.screenButtons[button];
    }

    event.preventDefault();
    return false;

  });


  $screen.addEventListener('wheel', function(event) {

    if (self.active === false) return false;

    var button = event.deltaY < 0 ? 4 : 5;

    getMousePointer(event, self);

    if (self.mouse.screenButtons[button] === undefined) {
      self.mouse.screenButtons[button] = true;
    }

    sendInput(self);

    event.preventDefault();
    return false;

  });


  $screen.addEventListener('mousemove', function(event) {

    if (self.active === false) return false;

    getMousePointer(event, self);
    sendInput(self);
  });


  window.addEventListener('focus', function() {
    self.active = true;
  });

  window.addEventListener('blur', function() {
    console.log('BLUR');
    self.active = false;
  });


}

function getMousePointer(event, self) {

  self.mouse.x = event.offsetX;
  self.mouse.y = event.offsetY;

  return true;
}


function getMouseStatus(self) {

  var result = {};

  if (Object.keys(self.mouse.screenButtons).length > 0) {
    result.buttons = Object.keys(self.mouse.screenButtons);
  }

  result.x = self.mouse.x;
  result.y = self.mouse.y;

  return result;

}


function sendInput(self) {
  self.update();
  self.emitter.emit('mouseUpdate');
  inputEnd(self);
}

function inputEnd(self) {

  //wheel
  delete self.mouse.screenButtons['4'];
  delete self.mouse.screenButtons['5'];

}

