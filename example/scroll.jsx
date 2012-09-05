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
        var image = new ui.Image('./test.png');

        var imageView = new ui.ImageView(image);

        var scrollView = new ui.ScrollView();
        scrollView.addSubview(imageView);
        scrollView.setContentSize(new ui.Size(320, 480));

        var rootController = new ui.ViewController();
        rootController.setView(scrollView);

        this.setRootViewController(rootController);
    }
}
