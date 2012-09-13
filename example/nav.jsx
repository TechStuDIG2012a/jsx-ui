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
    var top = new ui.NavigationController();
    top.setNavigationViewColor(ui.Color.GREEN, ui.Color.RED);

    var rootVC  = new FirstViewController();

    // top.initWithRootViewController(rootVC);
    top.pushViewController(rootVC, "first view!");

    log "abc";

    this.setRootViewController(top);
    
    log top.getView().getElement();
  }
}

class FirstViewController extends ui.ViewController {
  function constructor() {
    var rect = new ui.Rectangle(0, 0, ui.Platform.getWidth(), ui.Platform.getHeight());
    var view = new ui.View();
    view.initWithFrame(rect);

    var label = new ui.Label("go to second").toCenter();
    label.getElement().onclick = function(e : Event) : void {
      var newVC = new SecondViewController();
      var parent = this.getParentViewController() as ui.NavigationController;
      parent.pushViewController(newVC, "second view");
      log parent.getView().getElement();
      log parent.getStack();
    };

    view.addSubview(label);

    view.setBackgroundColor(ui.Color.BLUE);
    this.setView(view);
  }
}

class SecondViewController extends ui.ViewController {
  function constructor() {
    var rect = new ui.Rectangle(0, 0, ui.Platform.getWidth(), ui.Platform.getHeight());
    var view = new ui.View();
    view.initWithFrame(rect);

    var label1 = new ui.Label("go to third").toCenter();
    label1.getElement().onclick = function(e : Event) : void {
      var newVC = new ThirdViewController();
      var parent = this.getParentViewController() as ui.NavigationController;
      parent.pushViewController(newVC, "third view");
      log parent.getView().getElement();
      log parent.getStack();
    };
    
    var label2 = new ui.Label("back to first").toCenter();
    label2.getElement().onclick = function(e : Event) : void {
      var parent = this.getParentViewController() as ui.NavigationController;
      parent.popViewController();
      log parent.getView().getElement();
      log parent.getStack();
    };

    view.addSubview(label1);
    view.addSubview(label2);

    view.setBackgroundColor(ui.Color.GREEN);
    this.setView(view);
  }
}

class ThirdViewController extends ui.ViewController {
  function constructor() {
    var rect = new ui.Rectangle(0, 0, ui.Platform.getWidth(), ui.Platform.getHeight());
    var view = new ui.View();
    view.initWithFrame(rect);

    var label1 = new ui.Label("back to first").toCenter();
    label1.getElement().onclick = function(e : Event) : void {
      var newVC = new ThirdViewController();
      var parent = this.getParentViewController() as ui.NavigationController;
      parent.popToRootViewController();
      log parent.getView().getElement();
      log parent.getStack();
    };
    
    var label2 = new ui.Label("back to second").toCenter();
    label2.getElement().onclick = function(e : Event) : void {
      var parent = this.getParentViewController() as ui.NavigationController;
      parent.popViewController();
      log parent.getView().getElement();
      log parent.getStack();
    };

    // var label3 = new ui.Label("back to first using popToViewController").toCenter();
    // label3.getElement().onclick = function(e : Event) : void {
    //   var parent = this.getParentViewController() as ui.NavigationController;
    //   parent.popToViewController(new FirstViewController());
    //   log parent.getView().getElement();
    //   log parent.getStack();
    // };

    view.addSubview(label1);
    view.addSubview(label2);
    // view.addSubview(label3);

    view.setBackgroundColor(ui.Color.RED);
    this.setView(view);
  }
}
