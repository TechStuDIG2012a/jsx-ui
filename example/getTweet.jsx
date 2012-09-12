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
    var label = new ui.Label("table view test");
    mainView.addSubview(label);

    //log label;
    //log ui.Platform.getWidth();
    //log ui.Platform.getHeight();
    var tableView = new ui.TableView(new ui.Rectangle(0, 26, ui.Platform.getWidth(), ui.Platform.getHeight()));
    tableView._alwaysBounceVertical = true;
    tableView._autoExpand = false;
    tableView.setDataSource("http://api.twitter.com/1/statuses/public_timeline.json?trim_user=twitter");
    var viewList = this.createLabelListView();
    tableView.addSubview(viewList);
    tableView.setContentSize(new ui.Size(320, 5600));
    mainView.addSubview(tableView);

    var rootController = new ui.ViewController();
    rootController.setView(mainView);

    this.setRootViewController(rootController);

    this.setTimeline();

  }

  function createLabelListView() : ui.View {
    var view = new ui.View();
    for (var i=0; i<200; i++) {
      view.addSubview(new ui.Label('label : ' + (i as string)).toCenter());
    }
    return view;
  }


  function setTimeline() : void {
    var url = "http://api.twitter.com/1/statuses/public_timeline.json?trim_user=twitter&callback=?";
    var url = "public_timeline.json";
    var httpRequest = new XMLHttpRequest();
    httpRequest.open('GET', url, true);

    httpRequest.onreadystatechange = (e) -> {
      if(httpRequest.readyState == 4) {
        if(httpRequest.status == 200) {
          var tweets = new Array.<Tweet>;
          var data = JSON.parse(httpRequest.responseText) as Array.<Object>;
          data.forEach( (tw) -> {
            tweets.push(new Tweet(tw));
          });
          log tweets;
          // Todo: set timeline to TableView.
        }
      }
    };
    httpRequest.send();
  }
}

class Tweet {

  var created_at : string;
  var text: string;
  var screen_name : string;
  var user_id: int;
  var profile_image_url : string;

  function constructor (data : variant) {

    this.created_at = data['created_at'] as string;
    this.text = data['text'] as string;

    var user = data['user'];
    this.screen_name = user['screen_name'] as string;
    this.user_id = user['id'] as int;
    this.profile_image_url = user['profile_image_url'] as string;
  }
}
