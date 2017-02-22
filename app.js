var Steam = require('steam-web');
const fs = require('fs');
var dateFormat = require('dateformat');
var timer = require('timers');
const spawn = require('child_process').spawn; 
var wincmd = require('node-windows');

var def_steamkey = 'F8D756B20828053B061B1F5467961F63';
var def_steamname = 'th3meow';
var def_gameid = 440900;

var s = new Steam({
	apiKey: def_steamkey,
	format: 'json'
});

timer.setInterval( function() {
	var PID = -1;
	wincmd.list(function(svc) {
		for ( c in svc ) {
			if ( svc[c].ImageName == "ConanSandboxServer-Win64-Test.exe" )
				PID = svc[c].PID ;
		}
		if ( PID < 0 ) {
			console.log(dateFormat(Date.now(), "dddd, mmmm dS, yyyy, h:MM:ss TT" ))
			console.log("Starting Server");
			spawn('D:\\SteamCMD\\steamapps\\common\\Conan Exiles Dedicated Server\\ConanSandboxServer.exe', ['-log'], { cwd: 'D:\\SteamCMD\\steamapps\\common\\Conan Exiles Dedicated Server' });
		}
	}, false);
	
}, 1 * 1000);

timer.setInterval( function() {
	var announcements = [];
	s.getNewsForApp({
		appid: def_gameid,
		maxlength: 300,
		count: 10,
		callback: function(err, data) {
			var newnews = false ;
			if ( err ) return console.log(err);
			var news = data.appnews.newsitems;
			for ( var n in news ) {
				if ( news[n].feedname != 'steam_community_announcements' )
					news.splice(n,1);
			}
			
			if ( fs.existsSync('announcements.txt') ) {
				announcements = JSON.parse(fs.readFileSync('announcements.txt'));
			}
				
			for ( var n = news.length-1; n >= 0 ; n-- ) {
				var match = false;
				for ( var a in announcements ) {
					if ( news[n].gid == announcements[a].gid ) {
						match = true ;
					}
				}
				if ( match == false ) {
					announcements.splice(0,0,news[n]);
					console.log('New news: ' + news[n].title);
					newnews = true ;
				}
			}
			if ( newnews ) {
				fs.writeFile('announcements.txt', JSON.stringify(announcements), { flag: 'w' }, function(err) {
					if ( err ) return console.log(err);
				});
				
				console.log("Killing Server");
				var PID = -1;
				wincmd.list(function(svc) {
					for ( c in svc ) {
						if ( svc[c].ImageName == "ConanSandboxServer-Win64-Test.exe" )
							PID = svc[c].PID ;
					}
					if ( PID >= 0 ) {
						console.log("Server found running at PID " + PID);
						spawn('taskkill', ['/IM','ConanSandboxServer-Win64-Test.exe']);
					}
				}, false);
			}
			
		}
	});
},5 * 1000);