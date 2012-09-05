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

		var img = new ui.Image('./test.png', 500, 500);
    log img;
    log img.getOpacity();
    log img.getSize();
    log img.getImageRef();

		var img2 = new ui.Image('./test.png');
    img2.setOpacity(0.3);
    log img2;
    log img2.getSize();

		var view_img = new ui.ImageView(img);
    view.addSubview(view_img);
		var view_img2 = new ui.ImageView(img2);
    view.addSubview(view_img2);
	}
}

