
'use strict';

import domEvent from'./dom-event';

export default class Keyboard {

  constructor(option) {


    this.emitter = option.emitter;

    //this.inputTarget = option.inputTarget;
    this.inputTarget = document.querySelector(".viewer-wrap");
    this.active = true;
    this.isMac = /Mac/.test(navigator.platform);

    //this.channel = dataChannel;
    this.state = {
      'down': {},
      'up': {},
      'button': {},
      'capslock': false,   // specialkey 1
      'numlock': false,    // specialkey 2
      'scrolllock': false, // specialkey 4
      // shift: false      // specialkey 8
    };

    this.keysym = this.setKeysym();
    this.inputTarget.focus();


    addListeners(this);

  }

  defaultOption() {
    return {};
  }

  activate() {
    this.active = true;
  }

  inactivate() {
    this.active = false;
  }

  setKeysym() {
    return {
      '8'  : 0xFF08,  // backspace
      '9'  : 0xFF09,  // tab
      '13' : 0xFF0D,  // enter
      '16' : 0xFFE1,  // shift
      '17' : 0xFFE3,  // ctrl
      '18' : 0xFFE9,  // alt
      '19' : 0xFF13,  // pause/break
      '20' : 0,       // 0xFFE5 capslock
      '144': 0,       // 0xFF7F numlock
      '145': 0,       // 0xFF14 scrolllock
      '21' : 0xFFEB,  // hangul(0xFFEA RIGHT ALT)
      '25' : 0xFFF0,  // hanja (0xFFE4 RIGHT CTRL)
      '27' : 0xFF1B,  // escape
      '32' : 0x0020,  // space
      '33' : 0xFF55,  // page up
      '34' : 0xFF56,  // page down
      '35' : 0xFF57,  // end
      '36' : 0xFF50,  // home
      '37' : 0xFF51,  // left arrow
      '38' : 0xFF52,  // up arrow
      '39' : 0xFF53,  // right arrow
      '40' : 0xFF54,  // down arrow
      '45' : 0xFF63,  // insert
      '46' : 0xFFFF,  // delete
      '91' : 0,       // 0xFFEB left window key (hyper_l)
      '92' : 0,       // 0xFF67 right window key (menu key?)
      '93' : 0xFF60,  // menu key
      '112': 0xFFBE,  // F1
      '113': 0xFFBF,  // F2
      '114': 0xFFC0,  // F3
      '115': 0xFFC1,  // F4
      '116': 0xFFC2,  // F5
      '117': 0xFFC3,  // F6
      '118': 0xFFC4,  // F7
      '119': 0xFFC5,  // F8
      '120': 0xFFC6,  // F9
      '121': 0xFFC7,  // F10
      '122': 0xFFC8,  // F11
      '123': 0xFFC9,  // F12
      // special chars
      '59' : 0x003B,  // SEMICOLON (;) firefox
      '61' : 0x003D,  // EQUAL (=) firefox
      '173': 0x002D,  // DASH (-) firefox
      '186': 0x003B,  // SEMICOLON (;)
      '187': 0x003D,  // EQUAL (=)
      '188': 0x002C,  // COMMA (,)
      '189': 0x002D,  // DASH (-)
      '190': 0x002E,  // PERIOD (.)
      '191': 0x002F,  // SLASH (/)
      '192': 0x0060,  // GRAVE (`)
      '219': 0x005B,  // BRACKETOPEN ([)
      '220': 0x005C,  // BACKSLASH (\)
      '221': 0x005D,  // BRACKETCLOSE (])
      '222': 0x0022,  // QUOTE (')
      // 231: 0x005C,
      // number keys
      // 12: -1, //
      '96' : 0x0030,  // 0
      '97' : 0x0031,  // 1
      '98' : 0x0032,  // 2
      '99' : 0x0033,  // 3
      '100': 0x0034,  // 4
      '101': 0x0035,  // 5
      '102': 0x0036,  // 6
      '103': 0x0037,  // 7
      '104': 0x0038,  // 8
      '105': 0x0039,  // 9
      '106': -0x0038, // *
      '107': -0x003D, // +
      '109': 0x002D,  // -
      '110': 0x002E,  // .
      '111': 0x002F,  // /
    };

    let keymap = {
      'BACKSPACE': '8',
      'TAB' : '9',
      'ENTER': '13',
      'SHIFT': '16',
      'CTRL': '17',
      'ALT': '18',
      'PAUSE': '19',
      'BREAK': '19',
      'CAPSLOCK': '20',
      'RIGHTALT': '21',
      'RIGHTCTRL': '25',
      'ESC': '27',
      'SPACE': '32',
      'PAGEUP': '33',
      'PAGEDOWN': '34',
      'END': '35',
      'HOME': '36',
      'LEFT': '37',
      'UP': '38',
      'RIGHT': '39',
      'DOWN': '40',
      'INSERT': '45',
      'DELETE': '46',
      '0': '48',
      '1': '49',
      '2': '50',
      '3': '51',
      '4': '52',
      '5': '53',
      '6': '54',
      '7': '55',
      '8': '56',
      '9': '57',
      'A': '65',
      'B': '66',
      'C': '67',
      'D': '68',
      'E': '69',
      'F': '70',
      'G': '71',
      'H': '72',
      'I': '73',
      'J': '74',
      'K': '75',
      'L': '76',
      'M': '77',
      'N': '78',
      'O': '79',
      'P': '80',
      'Q': '81',
      'R': '82',
      'S': '83',
      'T': '84',
      'U': '85',
      'V': '86',
      'W': '87',
      'X': '88',
      'Y': '89',
      'Z': '90',
      'META': '91',
      'WIN': '91',
      'RIGHTMETA': '92',
      'RIGHTWIN': '92',
      'SELECT': '93',
      'NUM0': '96',
      'NUM1': '97',
      'NUM2': '98',
      'NUM3': '99',
      'NUM4': '100',
      'NUM5': '101',
      'NUM6': '102',
      'NUM7': '103',
      'NUM8': '104',
      'NUM9': '105',
      'MILTIPLY': '106',
      'ADD': '107',
      'SUBTRACT': '109',
      'DECIMAL': '110',
      'DIVIDE': '111',
      'F1': '112',
      'F2': '113',
      'F3': '114',
      'F4': '115',
      'F5': '116',
      'F6': '117',
      'F7': '118',
      'F8': '119',
      'F9': '120',
      'F10': '121',
      'F11': '122',
      'F12': '123',
      'NUMLOCK': '144',
      'SCROLLLOCK': '145',
      'SEMICOLON': '186', //59
      'EQUAL': '187', //61
      'COMMA': '188',
      'DASH': '189', //173
      'PERIOD': '190',
      'SLASH': '191',
      'FORWARDSLASH': '191',
      'GRAVE': '192',
      'BRACKETOPEN': '219',
      'BACKSLASH': '220',
      'BRACKETCLOSE': '221',
      'QUOTE': '222'
    };

  }



}

function addListeners(self) {

  self.inputTarget.querySelector('.viewer').addEventListener('click', function() {
    self.inputTarget.focus();
  });


  domEvent.add(document.body, 'keydown', function(event) {

    var keyCode = event.which;
    if (keyCode < 65 || keyCode > 90 || event.ctrlKey === true || event.altKey === true) { //!A-Z || ctrl || alt
      event.preventDefault();
      sendKey(self, event);
    }
    event.stopPropagation();
    return false;
  });

  domEvent.add(document.body, 'keypress', function(event) {


    var keyCode = event.which;
    if (keyCode >= 97 && keyCode <= 122) { //lowercase
      self.state.capslock = event.shiftKey;
      sendKey(self, event);
    }
    else if (keyCode >= 65 && keyCode <= 90 && !(event.shiftKey && self.isMac)) { //uppercase
      self.state.capslock = !event.shiftKey;
      sendKey(self, event);
    }
    event.stopPropagation();
    event.preventDefault();
    return false;
  });

  domEvent.add(document.body, 'keyup', function(event) {

    var keyCode = event.which;
    sendKey(self, event)
    event.stopPropagation();
    event.preventDefault();
    return false;
  });
}

function preventEvent(event) {
  event.stopPropagation();
  event.preventDefault();
  return false;
}

function sendKey(self, event) {


  if (self.active === false || event.target !== self.inputTarget) {
    return;
  }
  var isDown = (event.type == 'keydown' || event.type == 'keypress') ? 1 : 0
    , keyCode = event.which
    , isShift = event.shiftKey
    , specialkeystate = 0;
  if (event.type == 'keypress' && keyCode >= 97 && keyCode <= 122) {
    keyCode -= 32;
  }
  if (self.keysym[keyCode] !== undefined) {
    keyCode = self.keysym[keyCode];
    if (keyCode < 0) {
      keyCode = -keyCode;
      isShift = true;
    }
  }
  if (keyCode === 0) {
    return;
  }
  if (event.getModifierState !== undefined) {
    self.state.capslock = self.state.capslock || event.getModifierState('CapsLock');
    self.state.numlock = event.getModifierState('NumLock')
    self.state.scrolllock = event.getModifierState('ScrollLock') === true || event.getModifierState('Scroll') === true;
  }
  if (self.state.capslock === true) {
    specialkeystate += 1;
  }
  if (self.state.numlock === true) {
    specialkeystate += 2;
  }
  if (self.state.scrolllock === true) {
    specialkeystate += 4;
  }
  if (isShift === true) {
    specialkeystate += 8;
  }


  self.emitter.emit('keyboardUpdate',{
    'down': isDown,
    'key': parseInt(keyCode),
    'specialkeystate': specialkeystate
  });

}



