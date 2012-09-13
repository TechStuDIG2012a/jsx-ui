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
    var scrollView = new ui.ScrollView();
    var mainView = new ui.View();

    var listView = this.createLabelListView();
    // scrollView.addSubview(listView);
    scrollView._autoExpand = false;
    // scrollView._alwaysBounceVertical = true;
    log listView._frame;
    scrollView.setContentSize(new ui.Size(320, 5600));

    var iv = this.createImageView();
    var iv2 = this.createImageView();
    // log iv;
    scrollView.addSubview(iv);
    scrollView.addSubview(iv2);
    // // onloadされていないため、ImageViewのframe指定
    // // を直接しない場合は_bounds.sizeを読み込めない.
    // // TODO: 回避する処理を実装する
    // scrollView.setContentSize(iv._bounds.size);

    var rootController = new ui.ViewController();
    //rootController.setView(scrollView);
    mainView.addSubview(scrollView);
    rootController.setView(mainView);

    this.setRootViewController(rootController);
  }

  function createImageView() : ui.View {
    var image = new ui.Image('./test.png');
    var imageView = new ui.ImageView(image);
    return imageView;
  }

  function createLabelListView() : ui.View {
    var view = new ui.View();
    for (var i=0; i<200; i++) {
      view.addSubview(new ui.Label('label : ' + (i as string)).toCenter());
    }
    return view;
  }
}
