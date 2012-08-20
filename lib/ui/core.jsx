/***
 * SmartKit core classes
 *
 */

import "js/web.jsx" into web;

import "./event.jsx";

class Platform {
	static const _width  = 320;
	static const _height = 480;

	static function getWidth() : int {
		return Platform._width;
	}

	static function getHeight() : int {
		return Platform._height;
	}

	static const DEBUG = true;
}

class Util {
	static function format(fmt : string, list : int[]) : string {
		return fmt.replace(/%/g, function (s) {
			return list[s as int] as string;
		});
	}
	static function format(fmt : string, list : number[]) : string {
		return fmt.replace(/%/g, function (s) {
			return list[s as int] as string;
		});
	}
	static function format(fmt : string, list : string[]) : string {
		return fmt.replace(/%/g, function (s) {
			return list[s as int] as string;
		});
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

}

class Application implements Responder {
	var _width  = Platform.getWidth();
	var _height = Platform.getHeight();

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
		var children = rootElement.childNodes;
		for (var i = 0, l = children.length; i < l; ++i) {
			rootElement.removeChild(children[i]);
		}
		rootElement.appendChild(this.getElement());
	}

	function getElement() : web.HTMLElement {
		var element = this._view.getElement();
		var style   = element.style;
		style.border = "solid 1px black";

		style.width   = (this._width  - 2) as string + "px";
		style.height  = (this._height - 2) as string + "px";

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
	var _view : View;

	var _tabBarItem : TabBarItem = null;

	function constructor() {
		this._view = new View();
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

}

class TabBarController extends ViewController {
	var _viewControllers : Array.<ViewController>;
	var _tabBar : TabBar = null;

	function constructor() {
	}

	function setViewControllers(viewControllers : Array.<ViewController>) : void {
		this._viewControllers = viewControllers.concat(); // clone
		this._tabBar = new TabBar(viewControllers);

		this.getView().addSubview(this._tabBar);
		/*
		this._tabBar.forEachItem((item) -> {
			item.onClick((event) -> {
				item.getController().toBack();
			});
		});
		*/
	}

	function getTabBar() : TabBar {
		return this._tabBar;
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
	var _frame : Rectangle;
	var _backgroundColor : Color = Color.WHITE;

	var _subviews = new Array.<View>();

	function getFrame() : Rectangle {
		return this._frame;
	}
	function setFrame(rect : Rectangle) : void {
		this._frame = rect;
	}

	function getBackgroundColor() : Color {
		return this._backgroundColor;
	}
	function setBackgroundColor(color : Color) : void {
		this._backgroundColor = color;
	}

	function addSubview(view : View) : void {
		this._subviews.push(view);
	}

	function onClick(cb : function(:MouseEvent):void) : void {
		var listener = function (e : web.Event) : void {
			cb(new MouseEvent(e));
		};
		this.getElement().addEventListener("click", listener);
	}

	function show() : void {
		this.getElement().style.display = "none";
	}
	function hide() : void {
		this.getElement().style.display = "default";
	}

	override function _toElement() : web.HTMLElement {
		var block = Util.createDiv();
		block.style.backgroundColor = this._backgroundColor.toStyle();

		this._subviews.forEach( (view) -> {
			block.appendChild(view.getElement());
		});
		return block ;
	}
}

class Lable extends View {
	var _text : string;

	function constructor(text : string) {
		this._text = text;
	}

	override function _toElement() : web.HTMLElement {
		var element = Util.createSpan();
		element.appendChild(Util.createTextNode(this._text));
		return element;
	}
}

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
		style.width    = "100%";

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

			if (Platform.DEBUG) {
				style.border = "solid 1px red";
			}

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
		element.style.fontSize  = "2em";

		var text = Util.createTextNode(this._title);
		element.appendChild(text);
		return element;
	}
}

class TabBarItem extends BarItem {

	function constructor(title : string) {
		super(title);
	}
}

class NavigationBar extends View {

}

class ScrollVIew extends View {

}

class Control extends View {

}

class Label extends View {
}

class Button extends Control {

}

class TextField extends Control {

}


/* immutable */ class Color {
	static const BLACK      = new Color(0x00, 0x00, 0x00);
	static const DARK_GRAY  = new Color(0x54, 0x54, 0x54);
	static const LIGHT_GRAY = new Color(0xa8, 0xa8, 0xa8);
	static const WHITE      = new Color(0xFF, 0xFF, 0xFF);
	static const GRAY       = new Color(0x7f, 0x7f, 0x7f);
	static const RED        = new Color(0xFF, 0x00, 0x00);
	static const GREEN      = new Color(0x00, 0xFF, 0x00);
	static const BLUE       = new Color(0x00, 0xFF, 0x00);

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

	function toStyle() : string {
		return "rgba("
			+ this._r as string + ", "
			+ this._g as string + ", "
			+ this._b as string + ", "
			+ this._a as string + ")";
	}

	override function toString() : string {
		return this.toStyle();
	}
}

class Font {
	// TODO
}

