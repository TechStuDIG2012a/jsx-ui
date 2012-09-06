
import "js/web.jsx" into web;

abstract class UIEvent.<T> {
  var _event : T;

  function constructor(e : web.Event) {
    this._event = e as __noconvert__ T;
  }

  function getRawEvent() : T {
    return this._event;
  }

  function getTarget() : web.HTMLElement {
    return this._event.target as __noconvert__ web.HTMLElement;
  }
}

class UIMouseEvent extends UIEvent.<web.MouseEvent> {
  function constructor(e : web.Event) {
    super(e);
  }
}

/*
   vim: set expandtab:
   vim: set tabstop=2:
   vim: set shiftwidth=2:
 */
