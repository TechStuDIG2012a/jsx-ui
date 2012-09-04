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
		top.setView(view);

		var img = new ui.Image('./test.png');
    log img;
		var view_img = new ui.ImageView(img);
    view.addSubview(view_img);
	}
}

