//function sleep(ms) {
//  return new Promise(resolve => setTimeout(resolve, ms));
//}


//phantomjs
var webPage = require('webpage');
var page = webPage.create();
var system = require('system');

page.viewportSize = {
  width: 1600,
  height: 900
};

page.settings.userAgent = 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36';

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
			page.render('google_home2x.jpg', {format: 'jpeg', quality: '100'});
			console.log("screen dump");
			

        }, time); // Change timeout as required to allow sufficient time
		
		time += 2000;
		window.setTimeout(function () {
			var fs = require('fs');
			var content = page.content;
			fs.write("out_x.html", content, 'w');
			console.log("src dump");
            phantom.exit();
        }, time); // Change timeout as required to allow sufficient time 
		
		
    }
	});
}