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

    var rootController = new ui.ViewController();

    var mainView = new ui.View();

    // add title label.
    var label = new ui.Label("table view test");
    mainView.addSubview(label);

    // add tableView.
    var rect = new ui.Rectangle(0, 26, ui.Platform.getWidth(), ui.Platform.getHeight()-26);
    var tableView = new ui.TableView(rect);

    // var url = "http://api.twitter.com/1/statuses/public_timeline.json?trim_user=twitter";
    // tableView.setDataSource(url);
    // var data = JSON.parse('[{"name": "hoge1"}, {"name": "hoge2"}, {"name": "hoge3"}, {"name": "hoge4"}]') as Array.<Object>;

    var data = JSON.parse('[{"name": "hoge1"}, {"name": "hoge2"}, {"name": "hoge3"}, {"name": "hoge4"}]');
    data.forEach( (e) -> {
      log e;
    });

    tableView.setDataSource(data);

    // tableView.setCellType();
    // tableView.setContentSize(new ui.Size(320, 5600));

    // mainView.addSubview(tableView);
    rootController.setView(mainView);
    this.setRootViewController(rootController);
  }
}

