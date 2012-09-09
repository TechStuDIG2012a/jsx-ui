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
		var top = new ui.ViewController();
		this.setRootViewController(top);

		var view = new ui.View();
    // view.setBackgroundColor(ui.Color.GREEN);
		top.setView(view);

		var img = new ui.Image('./test.png');
		var img_view = new ui.ImageView(img);
    log img_view;
    view.addSubview(img_view);
    log view;

		var img2 = new ui.Image('./test.png');
		var img_view_small = new ui.ImageView(img2, new ui.Rectangle(0, 0, 70, 80));
    log img_view_small;
    view.addSubview(img_view_small);
	}
}

