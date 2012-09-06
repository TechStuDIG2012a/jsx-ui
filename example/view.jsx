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

    var rect = new ui.Rectangle(0, 0, 240, 380);
    var parent_view = new ui.View(rect);
    parent_view.setBackgroundColor(ui.Color.GREEN);
    log parent_view;

    for (var i=0; i<6; i++) {
      var r = new ui.Rectangle(10 + 30*i, 30, 20, 20);
      var v = new ui.View(r);
      v.setBackgroundColor(ui.Color.BLACK);
      parent_view.addSubview(v);
    }

    rect = new ui.Rectangle(100, 150, 100, 80);
    var bottom_view = new ui.View(rect);
    bottom_view.setBackgroundColor(ui.Color.BLUE);
    parent_view.addSubview(bottom_view);

    top.setView(parent_view);
  }
}

