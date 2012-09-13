/***
 * SmartKit core classes
 *
 * includes:
 *
 *
 */

import "timer.jsx";
import "js/web.jsx" into web;

import "./event.jsx";

class Platform {
  static function getWidth() : int {
    return web.dom.window.innerWidth;
  }

  static function getHeight() : int {
    return web.dom.window.innerHeight;
  }

  static const DEBUG = true;
}

class Util {
  static function format(fmt : string, list : variant[]) : string {
    return fmt.replace(/%\d+/g, (s) -> {
      var index = s.slice(1) as int - 1;
      return list[index] as string;
    });
  }

  static function format(fmt : string, list : int[]) : string {
    return Util.format(fmt, list as __noconvert__ variant[]);
  }
  static function format(fmt : string, list : number[]) : string {
    return Util.format(fmt, list as __noconvert__ variant[]);
  }
  static function format(fmt : string, list : string[]) : string {
    return Util.format(fmt, list as __noconvert__ variant[]);
  }

  static function createTextNode(s : string) : web.Node {
    return web.dom.document.createTextNode(s);
  }

  static function createElement(name : string) : web.HTMLElement {
    return web.dom.createElement(name);
  }

  static function createDiv() : web.HTMLElement {
    return Util.createElement("div");
  }

  // XXX: Mobile Safari (iOS 5.1) has no HTMLSpanElement
  static function createSpan() : web.HTMLElement {
    return Util.createElement("span");
  }

  static function createNavButton(left : boolean, anchorText : web.Node, href : string, onclick : function(:web.Event):void) : web.HTMLElement {
    var nav = Util.createElement("nav");
    // nav.className = "nav-page";
    var p = Util.createElement("p") as web.HTMLParagraphElement;
    // p.className = "nav-page-left";
    var a = Util.createElement("a") as web.HTMLAnchorElement;
    a.href = href;
    a.onclick = onclick;
    var span = Util.createSpan();

    span.appendChild(anchorText);
    a.appendChild(span);
    p.appendChild(a);
    nav.appendChild(p);
    
    var navStyle = nav.style;
    var pStyle = p.style;
    var aStyle = a.style;
    var spanStyle = span.style;

    navStyle.position = "absolute";
    navStyle.top = "0";
    if (left) {
      navStyle.left = "0";
    } else {
      navStyle.left = (Platform.getWidth() - 80) as string;
    }
    navStyle.width = "100%";

    pStyle.position = "absolute";
    pStyle.top = "5px";
    if (left) {
      pStyle.left = "10px";      
    } else {
      pStyle.left = (Platform.getWidth() - 80 + 10) as string + "px";
    }
    spanStyle.display = "block";
    spanStyle.float = "left";
    spanStyle.letterSpacing = "-1px";
    spanStyle.borderWidth = "1px";
    spanStyle.borderStyle = "solid";
    spanStyle.borderColor = "#ccc #444 #111 #444";
    spanStyle.font = "bold 15px/1em Ariel";
    spanStyle.color = "white";
    spanStyle.padding = "0.48em 1.0em";
    spanStyle.textShadow = "rgba(0,0,0,0.45) 0 -1px 0";
    spanStyle.webkitBoxShadow = "rgba(0,0,0,0.75) 0px 0px 3px";
    spanStyle.webkitBorderRadius = "7px";
    spanStyle.background = "transparent -webkit-gradient(linear, left top, left bottom, from(rgba(255,255,255,0.6)), color-stop(0.5, rgba(255,255,255,0.15)), color-stop(0.5, rgba(255,255,255,0.01)), to(transparent))";
    spanStyle.filter = "progid:DXImageTransform.Microsoft.Gradient(GradientType=0, StartColorstr='#80FFFFFF', EndColorstr='#00FFFFFF')";
    spanStyle.webkitBackgroundClip = "padding-box";

    return nav;
  }

  static function addSlideAnimation(clickedView : View, slideView : View) : void {
    var cnt = 0;
    clickedView.getElement().onclick = function(e:web.Event) : void {
      if (cnt == 0) {
    	slideView.getElement().style.webkitTransform = "translate3d(" + (Platform.getWidth() * 0.8) as string  + "px, 0, 0)";
    	slideView.getElement().style.webkitTransitionDuration = "300ms";
    	cnt++;
      } else {
    	slideView.getElement().style.webkitTransform = "translate3d(0, 0, 0)";
    	slideView.getElement().style.webkitTransitionDuration = "300ms";
    	cnt--;
      }
    };

    slideView.getElement().style.webkitTransform = "-webkit-transition:-webkit-transform ease";
  }

  static function replaceChildElements(element : web.HTMLElement, content: web.HTMLElement) : void {
    var children = element.childNodes;
    for (var i = 0, l = children.length; i < l; ++i) {
      element.removeChild(children[i]);
    }
    element.appendChild(content);
  }

  static function borderWithColor(color : Color) : string {
    return "solid 1px " + color.toString();
  }


  static function applyGradient(style : web.CSSStyleDeclaration, type : string, begin : string, end : string, fromColor : Color, toColor : Color) : void {
    // TODO: portability?
    var s = Util.format("-webkit-gradient(%1, %2, %3, from(%4), to(%5))",
        [type, begin, end, fromColor.toString(), toColor.toString()]);
    style.background = s;
  }
}

/* immutable */ class Point {
  var x : int;
  var y : int;

  function constructor(x : int, y : int) {
    this.x = x;
    this.y = y;
  }
}

/* immutable */ class Size {
  var width  : int;
  var height : int;

  function constructor(width : int, height : int) {
    this.width  = width;
    this.height = height;
  }
  function clone() : Size {
    return new Size(this.width, this.height);
  }
}

/* immutable */ class Rectangle {
  var origin : Point;
  var size : Size;

  function constructor(x : int, y : int, width : int, height : int) {
    this.origin = new Point(x, y);
    this.size   = new Size(width, height);
  }
}

mixin Responder {
  // TODO
}

class Application implements Responder {
  var _view : View;
  var _rootViewController : ViewController = null;

  function constructor() {
    this._view = new View();
    Application.resetStyles();
  }

  function setRootViewController(rootViewController : ViewController) : void {
    this._rootViewController = rootViewController;
  }

  function attach(rootElement : web.HTMLElement) : void {
    Util.replaceChildElements(rootElement, this.getElement());
  }

  function getElement() : web.HTMLElement {
    var element = this._view.getElement();
    var style   = element.style;

    element.appendChild(this._rootViewController.getView().getElement());
    return element;
  }

  static function resetStyles() : void {
    var s = "";
    s += "* {\n"
      + "margin: 0;\n"
      + "padding: 0;\n"
      + "font-size: 100%;\n"
      + "}\n"
      + "\n"
      + "body {\n"
      + "line-height: 1.0;\n"
      + "text-size-adjust: none;\n"
      + "}\n"
      + "\n"
      + "img {\n"
      + "border: 0;\n"
      + "vertical-align: bottom;\n"
      + "\n"
      + "table {\n"
      + "border-spacing: 0;\n"
      + "empty-cells: show;\n"
      + "}\n"
      + "\n" // HTML5 block elements
      + "article,aside,canvas,details,figcaption,figure,footer,header,"
      + "hgroup,menu,nav,section,summary {\n"
      + "display: block;\n"
      + "}"
      ;

    var textNode = Util.createTextNode(s);
    var style = Util.createElement("style");
    style.appendChild(textNode);

    web.dom.document.head.appendChild(style);
  }
}

class ViewController implements Responder {
  var _view : View = null;
  var _parentViewController : ViewController = null;

  var _tabBarItem : TabBarItem = null;

  var _navIndex = 0;

  function constructor() {
  }

  function setNavIndex(i : number) : void {
    this._navIndex = i;
  }

  function getNavIndex() : number {
    return this._navIndex;
  }

  function getView() : View {
    return this._view;
  }
  function setView(view : View) : void {
    this._view = view;
  }

  function getTabBarItem() : TabBarItem {
    return this._tabBarItem;
  }

  function setTabBarItem(item : TabBarItem) : void {
    this._tabBarItem = item;
  }

  function getParentViewController() : ViewController {
    return this._parentViewController;
  }

  function setParentViewController(viewController : ViewController) : void {
    this._parentViewController = viewController;
    // this._parentViewController.getView().getElement().appendChild(viewController.getView().getElement());
    this.setNavIndex(viewController.getNavIndex());
  }

  function getTabBarController() : TabBarController {
    return this._parentViewController as TabBarController;
  }

}

class OverlappedViewsController extends ViewController {
  var _mainView : View;
  var _subView : View;
  var _cnt = 0;
  var _dispWidth = Platform.getWidth();
  var _navigationController : NavigationController;
  
  function constructor() {
  }

  function constructor(main : View, sub : View) {
    this.setViewControllers(main, sub);
  }

  function setNavigationController(nav : NavigationController) : void {
    this._navigationController = nav;
  }

  function getNavigationController() : NavigationController {
    return this._navigationController;
  }

  function getMainView() : View {
    return this._mainView;
  }

  function getSubView() : View {
    return this._subView;
  }

  function setViewControllers(main : View, sub : View) : void {
    this._view = new View();
    this._mainView = main;
    this._subView = sub;
    this._cnt = 0;

    this._mainView.getElement().style.zIndex = "2";
    this._subView.getElement().style.zIndex = "1";

    // this.getNavigationView().setLeftButton("[ ]", "#", function(e:web.Event) : void {
    //   if (this._cnt == 0) {
    // 	this._mainView.getElement().style.webkitTransform = "translate3d(" + (this._dispWidth * 0.8) as string  + "px, 0, 0)";
    // 	this._mainView.getElement().style.webkitTransitionDuration = "300ms";
    // 	this._cnt++;
    //   } else {
    // 	this._mainView.getElement().style.webkitTransform = "translate3d(0, 0, 0)";
    // 	this._mainView.getElement().style.webkitTransitionDuration = "300ms";
    // 	this._cnt--;
    //   }
    // });

    // this._mainView.getElement().style.webkitTransform = "-webkit-transition:-webkit-transform ease";
    
//    this._mainView.getElement().onclick 

    this._view.addSubview(this._mainView);
    this._view.addSubview(this._subView);
  }
    
}

class TabBarController extends ViewController {
  var _viewControllers : Array.<ViewController>;
  var _selectedIndex : int = 0;
  var _tabBar : TabBar;

  function constructor() {
    var rect = new Rectangle(0, 0, Platform.getWidth(), Platform.getHeight());
    this._view = new View();
    this._view.initWithFrame(rect);
    this._view.setBackgroundColor(Color.RED);
  }

  function setViewControllers(viewControllers : Array.<ViewController>) : void {
    this._viewControllers = viewControllers.concat(); // clone

    this._viewControllers.forEach((controller) -> {
      controller.setParentViewController(this);
      this._view.addSubview(controller.getView());
      controller.getView().hide();
    });

    this._tabBar = new TabBar(this._viewControllers);
    // in order to take the tabbar forefront
    var selectedViewController = this._viewControllers[this._selectedIndex];
    if (selectedViewController instanceof OverlappedViewsController) {
      // MainView is forefront now. So we have to use z-index of MainView.
      this._tabBar.getElement().style.zIndex = ((selectedViewController as OverlappedViewsController).getMainView().getElement().style.zIndex as int + 1 ) as string;
    } else {
      // Other Controllers don't care about it above because they have 1 View.
      this._tabBar.getElement().style.zIndex = (selectedViewController.getView().getElement().style.zIndex as int + 1) as string; 
    }

    this._view.addSubview(this._tabBar);

    this.setSelectedIndex(this._selectedIndex);
  }

  function getTabBar() : TabBar {
    return this._tabBar;
  }

  function getSelectedIndex() : int {
    return this._selectedIndex;
  }

  function getSelectedViewController() : ViewController {
    return this._viewControllers[this._selectedIndex];
  }

  // function bringViewToFront(index : int) : void {
  //   var style = this._viewControllers[index].getView().getElement().style;
  //   style.zIndex = ((style.zIndex as int) + 1) as string;
  // }
  // function sendViewToBack(index : int) : void {
  //   var style = this._viewControllers[index].getView().getElement().style;
  //   style.zIndex = ((style.zIndex as int) - 1) as string;
  // }

  // function swapZIndex(indexA : int, indexB : int) : void {
  //   var styleA = this._viewControllers[indexA].getView().getElement().style;
  //   var styleB = this._viewControllers[indexB].getView().getElement().style;
  //   var tmp = styleA.zIndex;
  //   styleA.zIndex = styleB.zIndex;
  //   styleB.zIndex = tmp;
  // }

  function setSelectedIndex(index : int) : void {
    assert index >= 0;
    assert index < this._viewControllers.length;

    this._viewControllers[this._selectedIndex].getView().hide();

    this._selectedIndex = index;

    // XXX: to sync DOM and View structure?
    //this.getView()._popSubview();
    //this.getView().addSubview(this._viewControllers[index].getElement());
    this._viewControllers[this._selectedIndex].getView().show();
    // log this._viewControllers[this._selectedIndex].getView().getElement();
  }
}

class NavigationController extends ViewController {
  var _rootViewController : ViewController;
  var _stack : Array.<ViewController>;

  // var _navigationView : NavigationView = null;
  var _navigationViewStack : Array.<NavigationView>;
  var _mainView : View;

  var _navigationViewHeaderColor : Color = Color.LIGHT_GRAY;
  var _navigationViewTitleColor : Color = Color.DARK_GRAY;
  var _navigationViewTitle : string;
  
  function constructor() {
    this._stack = new Array.<ViewController>;
    this._navigationViewStack = new Array.<NavigationView>;

    var rect = new Rectangle(0, 0, Platform.getWidth(), Platform.getHeight());
    this._view = new View();
    this._view.initWithFrame(rect);
    this._view.setBackgroundColor(Color.LIGHT_GRAY);
    this._mainView = new View();
    var mainRect = new Rectangle(0, 45, Platform.getWidth(),Platform.getHeight() - 45);
    this._mainView.initWithFrame(mainRect);
    this._view.addSubview(this._mainView);
  }

  // function initWithRootViewController(rootVC : ViewController) : void {
  //   this.pushViewController(rootVC, "root View!");

  //   this._navigationView = new NavigationView();
  //   this._navigationView.setTitle(title);
  //   var navRect = new Rectangle(0, 0, Platform.getWidth(), 45);
  //   this._navigationView.initWithFrame(navRect);
  //   this._view.addSubview(this._navigationView);
  //   this._view.getElement().appendChild(this._navigationView.getElement());
  // }

  function getStack() : Array.<ViewController> {
    return this._stack;
  }

  function getNavigationViewStack() : Array.<NavigationView> {
    return this._navigationViewStack;
  }

  function setNavigationViewColor(headerColor : Color, titleColor : Color) : void {
    log "setcolor";
    this._navigationViewHeaderColor = headerColor;
    this._navigationViewTitleColor = titleColor;
  }

  function pushViewController(vc : ViewController, title : string) : void {
    log "push";
    this._navigationViewTitle = title;

    // change foreseen view !

    // remove old view!
    if (this._stack.length > 0) {
      var len = this._stack.length;
      var lastVC = this._stack[len-1];
      this._mainView.getElement().removeChild(lastVC.getView().getElement());
      var lastNV = this._navigationViewStack[len-1];
      this._view.getElement().removeChild(lastNV.getElement());
    }

    // make new view!
    vc.setParentViewController(this);
    this._mainView.addSubview(vc.getView());
    vc.setNavIndex(this._stack.length);
    this._stack.push(vc);
//    this._mainView.getElement().style.zIndex = "3";
    this._mainView.getElement().appendChild(vc.getView().getElement());

    var newNV = new NavigationView();
    newNV.setHeaderColor(this._navigationViewHeaderColor);
    newNV.setTitleColor(this._navigationViewTitleColor);
    newNV.setTitle(this._navigationViewTitle);
    var navRect = new Rectangle(0, 0, Platform.getWidth(), 45);
    newNV.initWithFrame(navRect);
    if (this._stack.length > 1) {
      newNV.setLeftButton("Back", "#", function(e : web.Event) : void {
	this.popViewController();
      });
    }
    this._view.addSubview(newNV);
    this._navigationViewStack.push(newNV);
    this._view.getElement().appendChild(newNV.getElement());
  }

  function popViewController() : void {
    // change foreseen view !
    if (this._stack.length <= 1) {
      return;
    }
    // remove old view!
    var lastVC = this._stack.pop();
    this._mainView.getElement().removeChild(lastVC.getView().getElement());
    var lastNV = this._navigationViewStack.pop();
    this._view.getElement().removeChild(lastNV.getElement());

    // make new view!;
    var len = this._stack.length;
    lastVC = this._stack[len-1];
    this._mainView.getElement().appendChild(lastVC.getView().getElement());
    lastNV = this._navigationViewStack[len-1];
    this._view.getElement().appendChild(lastNV.getElement());
  }

  function popToRootViewController() : void {
    while (this._stack.length > 1) {
      this.popViewController();
    }
  }
}

mixin Appearance {
  var _element : web.HTMLElement = null;

  function _toElement() : web.HTMLElement {
    var block = Util.createDiv();
    // TODO: common setting
    return block ;
  }

  function getElement() : web.HTMLElement {
    if (! this._element) {
      this._element = this._toElement();
    }
    return this._element;
  }

}

class View implements Responder, Appearance {
  var _backgroundColor : Color = Color.WHITE;

  var _parent : View = null;
  var _subviews = new Array.<View>();

  // added properties 
  /* frame: super viewの座標系におけるViewの原点とサイズ */
  var _frame : Rectangle;
  /* center: super viewの座標系におけるViewの中心 */
  var _center : Point;
  /* bounds: ローカル座標系におけるViewの原点とサイズ */
  var _bounds : Rectangle;
  var _alpha : number; 

  function constructor () {
  }

  function initWithFrame (frame : Rectangle) : void {
    this._frame = frame;
    this._bounds = new Rectangle(0, 0, frame.size.width, frame.size.height);
    this._center = new Point(frame.origin.x + frame.size.width/2,
                             frame.origin.y + frame.size.height/2);

  }

  function getBackgroundColor() : Color {
    return this._backgroundColor;
  }
  function setBackgroundColor(color : Color) : void {
    this._backgroundColor = color;
  }

  function getParent() : View {
    return this._parent;
  }

  function _popSubview(index : int) : void {
    this._subviews.pop()._parent = null;
  }

  function popSubview() : void {
    this._subviews.pop()._parent = null;
  }

  function addSubview(view : View) : void {
    assert this != view;

    this._subviews.push(view);
    view._parent = this;
  }

  function onClick(cb : function(:UIMouseEvent):void) : void {
    var listener = function (e : web.Event) : void {
      cb(new UIMouseEvent(e));
    };
    this.getElement().addEventListener("click", listener);
  }

  override function _toElement() : web.HTMLElement {
    var block = Util.createDiv();
    var style = block.style;

    style.backgroundColor = this._backgroundColor.toString();

    if (this._frame) {
      style.position = "absolute";
      style.width = this._bounds.size.width as string + "px";
      style.height = this._bounds.size.height as string + "px";
      style.left = this._frame.origin.x as string + "px";
      style.top = this._frame.origin.y as string + "px";
      // TODO _centerのCSS操作

    } else {
      style.width = "auto";
    }

    if (Platform.DEBUG) {
      //style.border = Util.borderWithColor(Color.BLUE);
    }

    this._subviews.forEach( (view) -> {
      block.appendChild(view.getElement());
    });
    return block;
  }

  // Controlls the viwwa and subviews

  function show() : void {
    // this.getElement().style.display = "default";
    this.getElement().style.display = "block";
  }
  function hide() : void {
    this.getElement().style.display = "none";
  }

  // function bringSubviewToFront(subview : View) : void {
  //   var style = subview.getElement().style;
  //   style.zIndex = ((style.zIndex as int) + 1) as string;
  // }
  // function sendSubviewToBack(subview : View) : void {
  //   var style = subview.getElement().style;
  //   style.zIndex = ((style.zIndex as int) - 1) as string;
  // }

}

class Lable extends View {
  var _text : string;

  function constructor(text : string) {
    this._text = text;
  }

  override function _toElement() : web.HTMLElement {
    var element = Util.createSpan(); // FIXME: super._toElement()?
    element.appendChild(Util.createTextNode(this._text));
    return element;
  }
}

/*
 * @see TabBarItem
 */
class TabBar extends View {
  var _controllers : Array.<ViewController>;

  var _height : int = 40;

  function constructor(controllers : Array.<ViewController>) {
    this._controllers = controllers;
  }

  override function _toElement() : web.HTMLElement {
    var element = super._toElement();
    var style   = element.style;
    style.height   = this._height as string + "px";
    style.position = "fixed";
    style.bottom   = "0px";
    style.width    = "10%";

    var itemWidth = (Platform.getWidth() / this._controllers.length) as int;

    this._controllers.forEach( (controller, i) -> {
      var item        = controller.getTabBarItem();
      var itemElement = item.getElement();
      var style       = itemElement.style;

      style.position = "fixed";
      style.bottom   = "0px";
      style.left  = (i * itemWidth) as string + "px";
      style.width = itemWidth as string + "px";
      style.height = this._height as string + "px";
      style.cursor = "pointer";

      if (Platform.DEBUG) {
        style.border = Util.borderWithColor(Color.RED);
      }

      itemElement.addEventListener("click", (e) -> {
	for (var j = 0; j < this._controllers.length; j++) {
	  if (this._controllers[j].getView().getElement().style.display != "none") {
	    this._controllers[j].getView().hide();
	    this._controllers[i].getView().show();
	  }
	}
      });

      element.appendChild(itemElement);
    });
    return element;
  }
}

class BarItem implements Appearance {
  var _title = "";
  var _controller : ViewController = null;

  function constructor(title : string) {
    this._title = title;
  }

  function setTitle(title : string) : void {
    this._title = title;
  }

  function setController(controller : ViewController) : void {
    this._controller = controller;
  }

  function getController(controller : ViewController) : ViewController {
    return this._controller;
  }

  override function _toElement() : web.HTMLElement {
    var element = Util.createSpan();
    element.style.textAlign = "center";

    var text = Util.createTextNode(this._title);
    element.appendChild(text);
    return element;
  }
}

class TabBarItem extends BarItem {

  function constructor(title : string) {
    super(title);
  }

  override function _toElement() : web.HTMLElement {
    var element = super._toElement();

    element.style.backgroundColor = "#eeeeee";

    return element;
  }
}

class NavigationView extends View {
  var _title : web.Node = null;
  var _leftButtonValid : boolean = false;
  var _rightButtonValid : boolean = false;
  var _leftAnchorText : web.Node = null;
  var _rightAnchorText : web.Node = null;
  var _leftHref : string = "";
  var _rightHref : string = "";
  var _leftOnclick : function(:web.Event):void;
  var _rightOnclick : function(:web.Event):void;
  var _titleColor : Color;
  var _headerColor : Color;

  function constructor() {
  }

  function setTitle(title : string) : void {
    this._title = Util.createTextNode(title);
  }

  function setTitle(title : web.Node) : void {
    this._title = title;
  }

  function setTitleColor(color : Color) : void {
    this._titleColor = color;
  }

  function setHeaderColor(color : Color) : void {
    this._headerColor = color;
  }

  function setLeftButton(anchorText : string, href : string, onclick : function(:web.Event):void) : void {
    this._leftButtonValid = true;
    this._leftAnchorText = Util.createTextNode(anchorText);
    this._leftHref = href;
    this._leftOnclick = onclick;
  }

  function setRightButton(anchorText : string, href : string, onclick : function(:web.Event):void) : void {
    this._rightButtonValid = true;
    this._rightAnchorText = Util.createTextNode(anchorText);
    this._rightHref = href;
    this._rightOnclick = onclick;
  }

  override function _toElement() : web.HTMLElement {
    //assert this._title != null;
    // assert this._anchorText != null;
    var element = super._toElement();

    var header = Util.createElement("header") as web.HTMLElement;
    // header.className = "global-header";
    var h1 = Util.createElement("h1") as web.HTMLHeadingElement;
    // h1.className = "page-heading";

    h1.appendChild(this._title);
    header.appendChild(h1);
    
    var leftNav : web.Element = null;
    if (this._leftButtonValid) {
      leftNav = Util.createNavButton(true, this._leftAnchorText, this._leftHref, this._leftOnclick);
      header.appendChild(leftNav);
    }

    var rightNav : web.Element = null;
    if (this._rightButtonValid) {
      var rightNav = Util.createNavButton(false, this._rightAnchorText, this._rightHref, this._rightOnclick);
      header.appendChild(rightNav);
    }
        
    var headerStyle = header.style;
    var h1Style = h1.style;
    
    headerStyle.borderBottom = Util.borderWithColor(Color.WHITE);
    // headerStyle.height = "44px";
    headerStyle.lineHeight = "44px";
//    headerStyle.backgroundColor = "#a8a8a8";
    headerStyle.backgroundColor = this._headerColor.toString();
//    headerStyle.position = "fixed";

    h1Style.margin = "0 auto";
    h1Style.width = "140px";
    h1Style.overflow = "hidden";
//    h1Style.color = "#333333";
    h1Style.color = this._titleColor.toString();
    h1Style.fontSize = "16px";
    h1Style.textAlign = "center";
    h1Style.whiteSpace = "nowrap";
    h1Style.textOverflow = "ellipsis";
    h1Style.textShadow = "0 1px #ffffff";
    
    //return header;
    element.style.zIndex = "5";
    element.appendChild(header);
    // log element;
    return element;
  }
  
}

class ScrollView extends View {
   var bounces : boolean = true;
   var _size : Size; // TODO: frameプロパティを実装する
   var _contentSize : Size;
   var pagingEnabled : boolean;
   var minimumZoomScale : number;
   var maximumZoomScale : number;
   var _x : int;
   var _y : int;
   var _vx : number;
   var _vy : number;

   var _title : string;

   function constructor() {
      this._size = new Size(320, 480);
      this._x = 0;
      this._y = 0;
   }

   function setContentSize(size : Size) : void {
      this._contentSize = size;
   }

   override function _toElement() : web.HTMLElement {
      var block = Util.createDiv();
      var style = block.style;

      style.backgroundColor = this._backgroundColor.toString();
      style.width = "auto";

      if (this._subviews.length != 0) {
         style.position = 'relative';
         style.top = '0px';
         style.left = '0px';

         var prevX = 0;
         var prevY = 0;
         var prevMsTime = (new Date()).getTime();
         block.addEventListener('mousedown', (e) -> {
            e.preventDefault();

            var me = e as web.MouseEvent;
            prevX = me.pageX;
            prevY = me.pageY;

            var handleMove = function(e : web.Event) : void {
               e.preventDefault();

               var curMsTime = (new Date()).getTime();
               var elapsedMs = curMsTime - prevMsTime;
               prevMsTime = curMsTime;

               var me = e as web.MouseEvent;
               var diffX = me.pageX - prevX;
               var diffY = me.pageY - prevY;

               this._vx = diffX / elapsedMs;
               this._vy = diffY / elapsedMs;

               // TODO: 下側と右側にも対応
               this._x += (this._x > 0) ? (diffX / 2) : (diffX);
               this._y += (this._y > 0) ? (diffY / 2) : (diffY);

               style.top = (this._y as string) + 'px';
               style.left = (this._x as string) + 'px';

               prevX = me.pageX;
               prevY = me.pageY;
            };

            block.addEventListener('mousemove', handleMove);

            // バウンドするようなモーションで、表示位置を修正する
            var backToCorrectPosition = function () : void {
               var fw = this._size.width;  // frame width
               var fh = this._size.height; // frame height
               var cw = this._contentSize.width;  // content width
               var ch = this._contentSize.height; // content height 

               if (this._x > 0) {
                  this._x /= 1.1;
               }
               if (this._x + cw < fw) {
                  this._x = (fw - cw) + (this._x + cw - fw) / 1.2;
               }
               if (this._y > 0) {
                  this._y /= 1.1;
               }
               if (this._y + ch < fh) {
                  this._y = (fh - ch) + (this._y + ch - fh) / 1.2;
               }
               style.left = (this._x as string) + 'px';
               style.top = (this._y as string) + 'px';

               if (this._x > 0 || this._y > 0 || this._x + cw < fw || this._y + ch < fh) {
                  Timer.setTimeout(backToCorrectPosition, 33);
               }
            };

            // 速度を減衰させつつスクロールする
            var decelerating = function () : void {
               var fw = this._size.width;  // frame width
               var fh = this._size.height; // frame height
               var cw = this._contentSize.width;  // content width
               var ch = this._contentSize.height; // content height 

               this._x += this._vx * 33;
               this._y += this._vy * 33;

               style.left = (this._x as string) + 'px';
               style.top = (this._y as string) + 'px';

               log this._vy;

               if (this._x > 0 || this._x + cw < fw) {
                  this._vx /= 2;
               } else {
                  if (Math.abs(this._vx) < 0.01) {
                     this._vx = 0;
                  } else if (this._vx < 0) {
                     this._vx += 0.05;
                  } else if (this._vx > 0) {
                     this._vx -= 0.05;
                  }
               }
               if (this._y > 0 || this._y + ch < fh) {
                  this._vy /= 2;
               } else {
                  if (Math.abs(this._vy) < 0.05) {
                     this._vy = 0;
                  } else if (this._vy < 0) {
                     this._vy += 0.05;
                  } else if (this._vy > 0) {
                     this._vy -= 0.05;
                  }
               }

               if (Math.abs(this._vx) > 0.001 || Math.abs(this._vy) > 0.001) {
                  Timer.setTimeout(decelerating, 33);
               } else {
                  Timer.setTimeout(backToCorrectPosition, 33);
               }
            };


            block.addEventListener('mouseup', (e) -> {
               block.removeEventListener('mousemove', handleMove);
               Timer.setTimeout(decelerating, 33);
            });

         });
      }

      this._subviews.forEach( (view) -> {
         block.appendChild(view.getElement());
      });
      return block;
   }
}

class Control extends View {

}

class Label extends View {
  var _content : web.Node = null;
  var _color : Color = Color.DARK_TEXT;
  var _align : string;

  function constructor() {
  }

  function constructor(text : string) {
    this.setText(text);
  }

  function setText(content : string) : void {
    this._content = Util.createTextNode(content);
  }

  function setText(content : web.Node) : void {
    this._content = content;
  }

  function setAlign(align : string) : void {
    this._align = align;
  }

  function toCenter() : Label {
    this.setAlign("center");
    return this;
  }
  function toLeft() : Label {
    this.setAlign("left");
    return this;
  }
  function toRight() : Label {
    this.setAlign("right");
    return this;
  }

  override function _toElement() : web.HTMLElement {
    assert this._content != null;

    var element = super._toElement(); // <div>
    element.appendChild(this._content);

    var style = element.style;
    style.color     = this._color.toString();
    style.textAlign = this._align;
    style.padding = "5px";
    style.margin  = "2px";

    style.borderRadius = "8px";
    Util.applyGradient(style, "linear", "left top", "left bottom", Color.WHITE, Color.LIGHT_GRAY);


    return element;
  }
}

class Image {
  var size : Size;
  var imageRef = web.dom.document.createElement("img") as web.HTMLImageElement;

  function constructor(imageNamed : string) {
    this.setImageRef(imageNamed);

    var self = this;
    this.imageRef.onload = (e) -> {
      self.setSize(new Size(self.getImageRef().naturalWidth, self.getImageRef().naturalHeight));
    };
  }
  
  function setImageRef(imageNamed: string) : void {
    this.imageRef.src = imageNamed; 
  }
  
  function getImageRef() : web.HTMLImageElement {
    return this.imageRef; 
  }

  function setSize(size : Size) : void {
    this.size = size;
  }

  function getSize() : Size {
    return this.size;
  }
}

class ImageView extends View {
  var _image : Image;

  function constructor(image : Image) {
    this._image = image;
  }

  override function _toElement() : web.HTMLElement {
    assert this._image.imageRef != null;

    var element = this._image.imageRef;
    var style = element.style;

    if (this._frame) {
      style.width = this._bounds.size.width as string + "px";
      style.height = this._bounds.size.height as string + "px";
      style.left = this._frame.origin.x as string + "px";
      style.top = this._frame.origin.y as string + "px";
      // TODO _centerのCSS操作
    }
    return element;
  }
}

class ProgressView extends View {
  var _max : number = 100;
  var _value : number = 0;
  
  function constructor() {
  }

  function constructor(max : number) {
    this.setMax(max);
  }

  function constructor(max : number, value : number) {
    this.setMax(max);
    this.setValue(value);
  }

  function progress(diff : number) : void {
    this._value += diff;
    if (this._value >= this._max) {
      this._value = this._max;
    }
  }

  function setMax(max : number) : void {
    this._max = max;
  }

  function setValue(value : number) : void {
    this._value = value;
  }

  override function _toElement() : web.HTMLProgressElement {
    // assert this._content != null;
    // var element = super._toElement(); // <div>
    var element = Util.createElement("progress") as web.HTMLProgressElement;

    var style = element.style;
    // style.max = this._max;
    // style.value = this._value;

    return element;
  }

}

class MenuView extends View {
  var _ddNum : number;
  var _ddNodes = [] : Array.<web.Node>;
  var _handlers = [] : Array.<function(: web.Event) : void>;

  function constructor (nodeNum : number) {
    this._ddNum = nodeNum;
    for (var i = 0; i < this._ddNum; i++) {
      this._ddNodes.push(Util.createTextNode(i as string));
    }
  }

  function setText(nodeIndex : number, nodeText : string) : void {
    this._ddNodes[nodeIndex] = Util.createTextNode(nodeText);
  }

  function setHandler(index : number, 
		      handler : function (: web.Event) : void) : void {
    this._handlers[index] = handler;
  }
  
  override function _toElement() : web.HTMLElement {
    var nav : web.HTMLElement = Util.createElement("nav");
    var dl : web.HTMLDListElement = Util.createElement("dl") as web.HTMLDListElement;
    var dds = [] : Array.<web.HTMLElement>;

    for (var i = 0; i < this._ddNum; i++) {
      dds.push(Util.createElement("dd"));
            
      dds[i].appendChild(this._ddNodes[i]);
      dds[i].onclick = this._handlers[i];
    }

    for (var i = 0; i < this._ddNum; i++) {
      dl.appendChild(dds[i]);
    }
    
    nav.appendChild(dl);
   
    var navStyle = nav.style;
    navStyle.width = "100%";
    navStyle.margin = "0%";
    navStyle.height = "auto";
    navStyle.overflow = "hidden";
    navStyle.marginBottom = "10px";
    // navStyle.textAlign = "right";
    // navStyle.float = "right";

    var dlStyle = dl.style;
    dlStyle.width = "100%";
    dlStyle.height = "100%";
    dlStyle.overflow = "hidden";

    for (var i = 0; i < this._ddNum; i++) {
      var ddStyle = dds[i].style;
      ddStyle.width = "92%";
      ddStyle.backgroundColor = "#FFFFFF";
      ddStyle.border = "1px solid #999999";
      ddStyle.padding = "10px";
      ddStyle.color = "#222222";
      ddStyle.display = "block";
      ddStyle.fontSize = "14px";
      ddStyle.fontWeight = "bold";
      if (i != this._ddNum - 1) {
      	ddStyle.marginBottom = "-1px";
      }
      // if (i == 0) {
      // 	ddStyle.borderTopLeftRadius = "8px";
      // 	ddStyle.borderTopRightRadius = "8px";
      // }
      // if (i == this._ddNum - 1) {
      // 	ddStyle.borderBottomLeftRadius = "8px";
      // 	ddStyle.borderBottomRightRadius = "8px";
      // }
    }

    return nav;
  }

}

class Button extends Control {

  // FIXME KAZUHO circular reference
  var _node = web.dom.document.createElement("INPUT") as web.HTMLInputElement;

  function constructor() {
    this._node.type = "button";
  }

  function constructor(label : string, handler : function(: web.Event) : void) {
    this();
    this.setLabel(label);
    this.setHandler(handler);
  }

  function setLabel(label : string) : Button {
    this._node.value = label;
    return this;
  }

  function getLabel() : string {
    return this._node.value;
  }

  function setHandler(handler : function (: web.Event) : void) : Button {
    this._node.onclick = handler;
    return this;
  }

  function getHandler() : function (: web.Event) : void {
    return this._node.onclick;
  }

  override function _toElement() : web.HTMLElement {
    var element = super._toElement(); // <div>

    element.appendChild(this._node);

    var style = this._node.style;
    style.width = "100%";

    return element;
  }

}

class TextField extends Control {

  // FIXME KAZUHO circular reference
  var _node = web.dom.document.createElement("INPUT") as web.HTMLInputElement;

  function constructor() {
  }

  function constructor(text : string) {
    this._node.value = text;
  }

  function getValue() : string {
    return this._node.value;
  }

  function setValue(text : string) : void {
    this._node.value = text;
  }

  override function _toElement() : web.HTMLElement {
    var element = super._toElement(); // <div>

    element.appendChild(this._node);

    var style = this._node.style;
    style.width = "100%";

    return element;
  }

}


/* immutable */ class Color {
  static const BLACK      = new Color(0x00, 0x00, 0x00);
  static const DARK_GRAY  = new Color(0x54, 0x54, 0x54);
  static const LIGHT_GRAY = new Color(0xa8, 0xa8, 0xa8);
  static const WHITE      = new Color(0xFF, 0xFF, 0xFF);
  static const GRAY       = new Color(0x7f, 0x7f, 0x7f);
  static const RED        = new Color(0xFF, 0x00, 0x00);
  static const GREEN      = new Color(0x00, 0xFF, 0x00);
  static const BLUE       = new Color(0x00, 0x00, 0xFF);

  static const LIGHT_TEXT = new Color(0x99, 0x99, 0x99);
  static const DARK_TEXT  = new Color(0x00, 0x00, 0x00);

  var _r : int;
  var _g : int;
  var _b : int;
  var _a : number;

  function constructor(r : int, g : int, b : int) {
    this(r, g, b, 1.0);
  }
  function constructor(r : int, g : int, b : int, a : number) {
    this._r = r;
    this._g = g;
    this._b = b;
    this._a = a;
  }

  function toRGBAStyle() : string {
    return "rgba("
      + this._r as string + ", "
      + this._g as string + ", "
      + this._b as string + ", "
      + this._a as string + ")";
  }


  function _hex02(c : int) : string {
    var s = c.toString(16);
    return s.length > 1 ? s : "0" + s;
  }

  function toHexStyle() : string {
    return "#"
      + this._hex02(this._r)
      + this._hex02(this._g)
      + this._hex02(this._b);
  }

  override function toString() : string {
    return this.toRGBAStyle();
  }
}

class Font {
  // TODO
}

/*
   vim: set expandtab:
   vim: set tabstop=2:
   vim: set shiftwidth=2:
 */
