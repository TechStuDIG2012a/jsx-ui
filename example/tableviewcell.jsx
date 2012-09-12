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

		var tableViewCell = new ui.TableViewCell();
    
    tableViewCell.setImage("http://a0.twimg.com/profile_images/976807881/face_normal.jpg");
    tableViewCell.setText("screen_name");
    tableViewCell.setDetailTextLabel("draw a tweet here. \n **** **** **** **** **** **** **** **** **** **** **** **** **** **** **** **** **** ****.");
		top.setView(tableViewCell);
	}
}
