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

    // var rootVC  = new FirstViewController();
    var rootVC = new ui.TabBarController();
    var firstVCfirstTab = new FirstViewController();
    var firstVCsecondTab = new SecondViewController();

    firstVCfirstTab.setNavigationController(top);
    
    rootVC.setViewControllers([firstVCfirstTab, firstVCsecondTab] : ui.ViewController[]);

    top.pushViewController(rootVC, "first view!");

    log "abc";

    this.setRootViewController(top);
    
    log top.getView().getElement();
  }
}

class FirstViewController extends ui.OverlappedViewsController {
  function constructor() {
    // set tabbaritem
    this.setTabBarItem(new ui.TabBarItem("first"));

    // make main view
    var view = new ui.View();
    var rect = new ui.Rectangle(0, 0, ui.Platform.getWidth(), ui.Platform.getHeight());
    view.initWithFrame(rect);
    view.setBackgroundColor(ui.Color.BLUE);

    var label = new ui.Label("go to second").toCenter();
    var labelRect = new ui.Rectangle(0, 0, ui.Platform.getWidth() - 10, 20);
    label.initWithFrame(labelRect);
    label.getElement().onclick = function(e : Event) : void {
      var newVC = new ThirdViewController();
      var parent = this.getParentViewController().getParentViewController() as ui.NavigationController;
      parent.pushViewController(newVC, "second view");
      log parent.getView().getElement();
      log parent.getStack();
    };

    var menuLabel = new ui.Label("menu").toCenter();
    var menuLabelRect = new ui.Rectangle(0, 30, ui.Platform.getWidth() - 10, 20);
    menuLabel.initWithFrame(menuLabelRect);

    view.addSubview(label);
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

class SecondViewController extends ui.ViewController {
  function constructor() {
    this.setTabBarItem(new ui.TabBarItem("second"));

    var scrollView = new ui.ScrollView();
    scrollView.addSubview(this.createLabelListView());
    scrollView.setContentSize(new ui.Size(320, 5600));
    // view.addSubview(scrollView);

    // var rect = new ui.Rectangle(0, 0, ui.Platform.getWidth(), ui.Platform.getHeight());
    // var view = new ui.View();
    // view.initWithFrame(rect);

    // view.setBackgroundColor(ui.Color.BLUE);
    // this.setView(view);
    this.setView(scrollView);
  }

  function createLabelListView() : ui.View {
    var view = new ui.View();
    for (var i = 0; i < 30; i++) {
      view.addSubview(new ui.Label('label : ' + (i as string)).toCenter());
    }
    return view;
  }

}

class ThirdViewController extends ui.ViewController {
  function constructor() {
    var view = new ui.View();
    var rect = new ui.Rectangle(0, 0, ui.Platform.getWidth(), ui.Platform.getHeight());
    view.initWithFrame(rect);

    var label = new ui.Label("Please back by left upper button!").toCenter();
    view.addSubview(label);

    view.setBackgroundColor(ui.Color.GREEN);
    this.setView(view);
  }
}
