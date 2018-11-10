//phantomjs
var webPage = require('webpage');
var page = webPage.create();
var system = require('system');

page.viewportSize = {
  width: 1920,
  height: 1080
};

page.settings.userAgent = 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:63.0) Gecko/20100101 Firefox/63.0';
phantom.clearCookies();

if(system.args.length < 2)
{
	phantom.exit();
}
else
{
	page.open(system.args[1], function (status) 
	{	
		
	if (status !== 'success') {
        console.log('Unable to load the address!');
        phantom.exit();
    } else {
		var time = 0;	
		
		time += 10000;
        window.setTimeout(function () {
			page.sendEvent('keypress', page.event.key.Escape, null, null, 0x00);
			console.log("keypress ESC");
        }, time); // Change timeout as required to allow sufficient time 
		
		time += 2000;
		window.setTimeout(function () {
			page.render('rendered_preview.jpg', {format: 'jpeg', quality: '80'});
			console.log("screen dump");
			

        }, time); // Change timeout as required to allow sufficient time
		
		time += 2000;
		window.setTimeout(function () {
			var fs = require('fs');
			var content = page.content;
			fs.write("rendered_js.html", content, 'w');
			console.log("src dump");
			page.clearMemoryCache();
            phantom.exit();
        }, time); // Change timeout as required to allow sufficient time
    }
	});
}