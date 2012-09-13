import "../lib/ui/*.jsx" into ui;
import "js/web.jsx";
import "console.jsx";
import "timer.jsx";

class _Main {
  static function main(args : string[]) : void {
    console.time("application loading");

    var app = new MyApp();
    
    Timer.setTimeout(function() : void {
      log "timer";
      app.attach(dom.id("world"));
    }, 1000);
    console.timeEnd("application loading");
  }
}

class MyApp extends ui.Application {

  function constructor() {

    var mainView = new ui.View();
    var label = new ui.Label("timeline test");
    mainView.addSubview(label);

    var scrollView = new ui.ScrollView(new ui.Rectangle(0, 26, ui.Platform.getWidth(), ui.Platform.getHeight()-26));
    scrollView._alwaysBounceVertical = true;
    scrollView.setBackgroundColor(ui.Color.GRAY);

    var url = "public_timeline.json";
    var httpRequest = new XMLHttpRequest();
    // var self = this;
    httpRequest.open('GET', url, true);
    httpRequest.onreadystatechange = (e) -> {
      if(httpRequest.readyState == 4) {
        if(httpRequest.status == 200) {
          var data = JSON.parse(httpRequest.responseText) as Array.<Object>;
          data.forEach( (tw) -> {
            var tweet = new ui.Tweet(tw);
            var cell = new ui.TableViewCell();
            // cell._autoExpand = false;
            cell.setImage(tweet.profile_image_url);
            cell.setText(tweet.screen_name);
            cell.setDetailTextLabel(tweet.text);
            scrollView.addSubview(cell);
          });
          log data.length;
          scrollView.setContentSize(new ui.Size(320, data.length * 200));
        }
      }
    };
    httpRequest.send();


    var rootController = new ui.ViewController();
    rootController.setView(scrollView);


    this.setRootViewController(rootController);
  }
}

