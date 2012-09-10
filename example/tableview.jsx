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

    var tableView = new ui.TableView(new ui.Rectangle(0, 0, 70, 80));
    tableView.setDataSource("http://api.twitter.com/1/statuses/public_timeline.json?trim_user=twitter");
    var viewList = this.createLabelListView();
    tableView.addSubview(viewList);
    var rootController = new ui.ViewController();
    rootController.setView(tableView);

    this.setRootViewController(rootController);
  }

  function createLabelListView() : ui.View {
    var view = new ui.View();
    for (var i=0; i<200; i++) {
      view.addSubview(new ui.Label('label : ' + (i as string)).toCenter());
    }
    return view;
  }
}
