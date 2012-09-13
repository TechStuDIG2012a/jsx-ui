import "../lib/ui/*.jsx" into ui;
import "js/web.jsx";
import "console.jsx";

class _Main {
  static function main(args : string[]) : void {
    console.time("application loading");

    var app = new MyApp();
    app.attach(dom.id("world"));
    console.timeEnd("application loading");
  }
}

class MyApp extends ui.Application {
  function constructor() {

    var top = new ui.ViewController();
    this.setRootViewController(top);

    var rect = new ui.Rectangle(0, 0, 180, 170);
    var parentView = new ui.View(rect);
    // parentView._autoExpand = false;
    parentView.setBackgroundColor(new ui.Color(0x00, 0xff, 0x00, 0.1));

//    var button1 = new ui.Button("add default Label", function (e) {
//      var l = new ui.Label("added default label" as string);
//      l.setBackgroundColor(ui.Color.BLACK);
//
//      parentView.getElement().appendChild(l.getElement());
//
//      l.setPosition(new ui.Rectangle(l._element.offsetLeft, 
//                                  l._element.offsetTop,
//                                  l._element.offsetWidth,
//                                  l._element.offsetHeight));
//      parentView.addSubview(l);
//    });
//    parentView.addSubview(button1);

    rect = new ui.Rectangle(100, 150, 100, 80);

    var bottomView = new ui.View();
    // bottomView.setBackgroundColor(ui.Color.BLUE);
    bottomView.setBackgroundColor(new ui.Color(0x00, 0x00, 0xff, 0.5));
    bottomView._autoExpand = false;

    for (var i=0; i<5; i++) {
      var r = new ui.Rectangle(10 + 40*i, 30, 20, 20);
      var l = new ui.Label(i as string); //, r);
      // l.initWithFrame(r);
      l.setBackgroundColor(ui.Color.BLACK);
      bottomView.addSubview(l);
    }

    parentView.addSubview(bottomView);
    top.setView(parentView);
  }
}

