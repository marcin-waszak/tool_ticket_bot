//phantomjs
var webPage = require('webpage');
var page = webPage.create();
var system = require('system');

page.viewportSize = {
  width: 1600,
  height: 900
};

page.settings.userAgent = 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:63.0) Gecko/20100101 Firefox/63.0';
phantom.clearCookies();

if(system.args.length < 2)
{
	phantom.exit();
}
else
{
	console.log('Opening URL...');
	page.open(system.args[1], function (status) 
	{	
		
	if (status !== 'success') {
		console.log('Unable to load the address!');
		phantom.exit();
	} else {
		var time = 0;	
		
		time += 2000 + Math.floor(Math.random() * 2000);
		console.log("Wait for keypress +" + time + " ms");
		window.setTimeout(function () {
			page.sendEvent('keypress', page.event.key.Escape, null, null, 0x00);
			console.log("keypress ESC");
		}, time); // Change timeout as required to allow sufficient time 
		
		time += 5000 + Math.floor(Math.random() * 1500);
		console.log("Wait for javascript render +" + time + " ms");
		window.setTimeout(function () {
			page.render('rendered_preview.jpg', {format: 'jpeg', quality: '80'});
			console.log("Screen rendered!");
			
			var fs = require('fs');
			var content = page.content;
			fs.write("rendered_js.html", content, 'w');
			console.log("Source rendered!");
			page.clearMemoryCache();
			phantom.exit();
		}, time); // Change timeout as required to allow sufficient time
	}
	});
}