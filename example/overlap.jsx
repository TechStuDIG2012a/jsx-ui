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
    var top = new MyViewController();
    this.setRootViewController(top);
  }  
}

class MyViewController extends ui.OverlappedViewsController {
    function constructor() {
 
    // make main view
    var view = new ui.View();
    var rect = new ui.Rectangle(0, 0, ui.Platform.getWidth(), ui.Platform.getHeight());
    view.initWithFrame(rect);
    view.setBackgroundColor(ui.Color.BLUE);

    var menuLabel = new ui.Label("menu").toLeft();
    var menuLabelRect = new ui.Rectangle(0, 0, ui.Platform.getWidth()-10, 20);
    menuLabel.initWithFrame(menuLabelRect);

    view.addSubview(menuLabel);

    ui.Util.addSlideAnimation(menuLabel, view);

    // make menu view
    var subView = new ui.View();
    var subRect = new ui.Rectangle(0, 0, ui.Platform.getWidth(), ui.Platform.getHeight());
    subView.initWithFrame(subRect);
    subView.setBackgroundColor(ui.Color.RED);
    
    var menu = new ui.MenuView(3);
    subView.addSubview(menu);
    menu.setText(0, "zero");
    menu.setText(1, "one");
    menu.setText(2, "two");
    menu.setHandler(0, function(e : Event) : void {
      dom.window.alert("I'm first row");
    });
    menu.setHandler(1, function(e : Event) : void {
      dom.window.alert("I'm second row");
    });
    menu.setHandler(2, function(e : Event) : void {
      dom.window.alert("I'm third row");
    });

    this.setViewControllers(view, subView);
  }
 
}