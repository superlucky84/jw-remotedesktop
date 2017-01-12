'use strict';

var Emitter = require('./emitter');
import $ from './dom-helper';

export default class Scroller extends Emitter {


  constructor(option) {

    super();

    this.op = option;

    this.scrollWrap = document.querySelector(".viewer-wrap");
    this.scrollInner = this.scrollWrap.querySelector('.viewer');


    this.psX = null;
    this.psY = null;

    this.scX = null;
    this.scY = null;

    this.rating = {
      'X': 0,
      'Y': 0
    };

    this.drag = {
      'X': false,
      'Y': false 
    }

    this.scrollShowTimeout = {
      X: null, 
      Y: null
    };

    this.scrollMoveTimeout = {
      X: null, 
      Y: null
    };

    this.scrollDragStandard = {
      X: [], 
      Y: []
    },

    this.addScroll();
    this.makeScrollPosition();
    this.setScrollTop();
    this.initEvent();

  }

  addScroll() {

    var jwscrollWrap = this.scrollWrap;

    this.scY = document.createElement("div");
    this.psY = document.createElement("div");
    this.psY.className = "ps-y";
    this.scY.className = "sc-y";
    this.scY.appendChild(this.psY);
    jwscrollWrap.appendChild(this.scY);


    this.scX = document.createElement("div");
    this.psX = document.createElement("div");
    this.psX.className = "ps-x";
    this.scX.className = "sc-x";
    this.scX.appendChild(this.psX);
    jwscrollWrap.appendChild(this.scX);

  }


  makeScrollPosition() {
    var jwscroll = this.scrollInner;

    var psY = this.psY;
    var scrollHeight = jwscroll.scrollHeight;
    var clientHeight = jwscroll.clientHeight;

    var virticalPercent = (clientHeight/scrollHeight) * 100;
    psY.style.height = virticalPercent+"%";


    var psX = this.psX;
    var scrollWidth = jwscroll.scrollWidth;
    var clientWidth = jwscroll.clientWidth;

    var holiPercent = (clientWidth/scrollWidth) * 100;
    psX.style.width = holiPercent+"%";


  }

  setScrollTop() {

    var jwscroll = this.scrollInner;

    var psY = this.psY;
    var scrollHeight = jwscroll.scrollHeight;
    var clientHeight = jwscroll.clientHeight;
    var scrollBottom = scrollHeight - clientHeight;
    var scrollBottomPer = (jwscroll.scrollTop / scrollHeight) * 100;

    this.rating.Y = clientHeight/scrollHeight;
    psY.style.top = scrollBottomPer+"%";


    var psX = this.psX;
    var scrollWidth = jwscroll.scrollWidth;
    var clientWidth = jwscroll.clientWidth;
    var scrollRight = scrollWidth - clientWidth;
    var scrollRightPer = (jwscroll.scrollLeft / scrollWidth) * 100;

    this.rating.X = clientWidth/scrollWidth;
    psX.style.left = scrollRightPer+"%";

  }


  scrollShy() {

    var jwscroll = this.scrollInner;

    if ( jwscroll.scrollWidth > jwscroll.clientWidth ) {
      $.addClass(this.scX, 'show');
      clearTimeout(this.scrollShowTimeout.X);
      this.scrollShowTimeout.X = setTimeout(() => {
        $.removeClass(this.scX, 'show');
      },1000);
    }

    if ( jwscroll.scrollHeight > jwscroll.clientHeight ) {
      $.addClass(this.scY, 'show');
      clearTimeout(this.scrollShowTimeout.Y);
      this.scrollShowTimeout.Y = setTimeout(() => {
        $.removeClass(this.scY, 'show');
      },1000);
    }

    if ($.hasClass(this.scX,'show') && $.hasClass(this.scY,'show')) {
      $.addClass(this.scX, 'all');
      $.addClass(this.scY, 'all');
    }
    else {
      $.removeClass(this.scX, 'all');
      $.removeClass(this.scY, 'all');
    }


  }

  initEvent() {

    var self = this;

    self.scrollWrap.addEventListener('mouseleave',function() {

      if (self.scrollMoveTimeout['X']) {
        clearTimeout(self.scrollMoveTimeout['X']);
        self.scrollMoveTimeout['X'] = null;
      }

      if (self.scrollMoveTimeout['Y']) {
        clearTimeout(self.scrollMoveTimeout['Y']);
        self.scrollMoveTimeout['Y'] = null;
      }
    });

    document.addEventListener('mousemove', function(evt) {

      if (evt.target.id == 'screen' || evt.target.id == 'whiteboard') {
        self.scrollAutoMoveAction('X',evt);
        self.scrollAutoMoveAction('Y',evt);
      }

      if (evt.buttons != 1) {
        self.drag.X = false;
        self.drag.Y = false;
        return;
      }

      if (self.drag.X) {
        var changePx = evt.screenX - self.scrollDragStandard.X[0];
        var changeLeft = changePx / self.rating.X;
        var scrollLeft = self.scrollDragStandard.X[1] + changeLeft;
        self.scrollInner.scrollLeft = scrollLeft;
      }

      if (self.drag.Y) {
        var changePx = evt.screenY - self.scrollDragStandard.Y[0];
        var changeTop = changePx / self.rating.Y;
        var scrollTop = self.scrollDragStandard.Y[1] + changeTop;
        self.scrollInner.scrollTop = scrollTop;
      }

      evt.stopPropagation();

    });

    window.addEventListener('mouseup', function() {
      self.drag.X = false;
      self.drag.Y = false;
    });

    self.scrollInner.addEventListener('scroll', function() {
      self.setScrollTop();
      self.scrollShy();
    });

    window.addEventListener('resize',function() {
      self.makeScrollPosition();
      self.setScrollTop();
    });

    self.psY.addEventListener('mousedown', function(evt) {
      self.scrollDragStandard.Y[0] = evt.screenY;
      self.scrollDragStandard.Y[1] = self.scrollInner.scrollTop;
      self.drag.Y = true;
    });

    self.psX.addEventListener('mousedown', function(evt) {
      self.scrollDragStandard.X[0] = evt.screenX;
      self.scrollDragStandard.X[1] = self.scrollInner.scrollLeft;
      self.drag.X = true;
    });

    self.scX.addEventListener('mouseenter', function() {
      self.clearScrollMoveTimeout();
      self.scrollShy();
    });

    self.scY.addEventListener('mouseenter', function() {
      self.clearScrollMoveTimeout();
      self.scrollShy();
    });
  }

  clearScrollMoveTimeout() {
    var self = this;
    if (self.scrollMoveTimeout['X']) {
      clearTimeout(self.scrollMoveTimeout['X']);
      self.scrollMoveTimeout['X'] = null;
    }

    if (self.scrollMoveTimeout['Y']) {
      clearTimeout(self.scrollMoveTimeout['Y']);
      self.scrollMoveTimeout['Y'] = null;
    }
  }

  scrollAutoMoveAction(scrollType, evt) {

    var self = this;
    var getTypeValue = {
      'X': {
        'size': self.scrollWrap.clientWidth,
        'scTarget': 'scrollLeft'
      },
      'Y': {
        'size': self.scrollWrap.clientHeight,
        'scTarget': 'scrollTop'
      }
    }

    var pointer = evt['client'+scrollType] - self.op.bounding[scrollType];
    var postionStart  = parseInt(getTypeValue[scrollType].size/8);
    var postionEnd = parseInt(getTypeValue[scrollType].size - postionStart);

    if (pointer > postionEnd && !self.scrollMoveTimeout[scrollType]) {
      self.scrollMoveTimeout[scrollType] = setInterval(() => {
        self.scrollInner[getTypeValue[scrollType].scTarget] += 3; 
      },10);
    }
    else if (pointer < postionStart && !self.scrollMoveTimeout[scrollType]) {
      self.scrollMoveTimeout[scrollType] = setInterval(() => {
        self.scrollInner[getTypeValue[scrollType].scTarget] -= 3; 
      },10);
    }
    else if (pointer <= postionEnd && pointer >= postionStart && self.scrollMoveTimeout[scrollType] ) {
      clearTimeout(self.scrollMoveTimeout[scrollType]);
      self.scrollMoveTimeout[scrollType] = null;
    }
  }
}

