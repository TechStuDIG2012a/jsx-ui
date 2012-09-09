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
    var parent_view = new ui.View(rect);
    // parent_view._autoExpand = false;
    parent_view.setBackgroundColor(new ui.Color(0x00, 0xff, 0x00, 0.1));

    var button1 = new ui.Button("add default Label", function (e) {
      var l = new ui.Label("added default label" as string);
      l.setBackgroundColor(ui.Color.BLACK);

      parent_view.getElement().appendChild(l.getElement());

      l.setPosition(new ui.Rectangle(l._element.offsetLeft, 
                                  l._element.offsetTop,
                                  l._element.offsetWidth,
                                  l._element.offsetHeight));
      parent_view.addSubview(l);
    });


    parent_view.addSubview(button1);


    // rect = new ui.Rectangle(100, 150, 100, 80);
    var bottom_view = new ui.View();
    bottom_view.setBackgroundColor(ui.Color.BLUE);
    bottom_view._autoExpand = false;

    for (var i=0; i<5; i++) {
      var r = new ui.Rectangle(10 + 40*i, 30, 20, 20);
      var l = new ui.Label(i as string); //, r);
      // l.initWithFrame(r);
      l.setBackgroundColor(ui.Color.BLACK);
      bottom_view.addSubview(l);
    }


    parent_view.addSubview(bottom_view);
    top.setView(parent_view);
  }
}

