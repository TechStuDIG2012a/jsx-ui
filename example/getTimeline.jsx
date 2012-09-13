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

    var mainView = new ui.View();
    // var label = new ui.Label("timeline test");
    // mainView.addSubview(label);

    var tableView = new ui.TableView(new ui.Rectangle(0, 26, ui.Platform.getWidth(), ui.Platform.getHeight()-26));
    tableView._alwaysBounceVertical = true;
    tableView.setBackgroundColor(ui.Color.GRAY);
    tableView.setDataSource("public_timeline.json");
    tableView.setCellType(new ui.TableViewCell());
    //var listView = this.createLabelListView();
    //tableView.addSubview(listView);
    tableView.setContentSize(new ui.Size(320, 5600));
    log "tableView";
    log tableView;
    mainView.addSubview(tableView);

    var rootController = new ui.ViewController();
    rootController.setView(mainView);


    this.setRootViewController(rootController);
    // this.setTimeline();
    // log tableView.getElement();
    // log mainView.getElement();
  }

  function createLabelListView() : ui.View {
    var view = new ui.View();
    for (var i=0; i<200; i++) {
      view.addSubview(new ui.Label('label : ' + (i as string)).toCenter());
    }
    return view;
  }
}

