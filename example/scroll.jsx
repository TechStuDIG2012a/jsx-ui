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
        scrollView.addSubview(this.createLabelListView());
        scrollView.setContentSize(new ui.Size(320, 5600));

        var rootController = new ui.ViewController();
        rootController.setView(scrollView);

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
