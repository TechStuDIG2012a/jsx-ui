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
    var parent_view = new ui.View();
    parent_view.initWithFrame(rect);
    parent_view.setBackgroundColor(new ui.Color(0x00, 0xff, 0x00, 0.1));
    parent_view.setOpacity(0.5); 
    //parent_view.setBackgroundColor(ui.Color.BLACK);
    log parent_view;

    for (var i=0; i<5; i++) {
      var r = new ui.Rectangle(10 + 40*i, 30, 20, 20);
      var l = new ui.Label(i as string);
      l.initWithFrame(r);
      l.setBackgroundColor(ui.Color.BLACK);
      parent_view.addSubview(l);
    }

    rect = new ui.Rectangle(100, 150, 100, 80);
    var bottom_view = new ui.View();
    bottom_view.initWithFrame(rect);
    bottom_view.setBackgroundColor(ui.Color.BLUE);
    parent_view.addSubview(bottom_view);
    top.setView(parent_view);
  }
}

