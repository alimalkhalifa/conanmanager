var Steam = require('steam-web');
const fs = require('fs');
var dateFormat = require('dateformat');
var timer = require('timers');
const spawn = require('child_process').spawn;
const exec = require('child_process').execSync;
var wincmd = require('node-windows');

var def_steamkey = 'F8D756B20828053B061B1F5467961F63';
var def_steamname = 'th3meow';
var def_gameid = 440900;

var s = new Steam({
	apiKey: def_steamkey,
	format: 'json'
});

console.log("Conan DS Manager");
console.log("By Ali");

timer.setInterval( function() {
	var PID = -1;
	wincmd.list(function(svc) {
		for ( c in svc ) {
			if ( svc[c].ImageName == "ConanSandboxServer-Win64-Test.exe" )
				PID = svc[c].PID ;
		}
		if ( PID < 0 ) {
			wincmd.list(function(svd) {
				for ( d in svc ) {
					if ( svd[d].ImageName == "steamcmd.exe")
						PID = svd[d].PID ;
				}
				if ( PID < 0 ) {
					console.log(dateFormat(Date.now(), "dddd, mmmm dS, yyyy, h:MM:ss TT" ))
					console.log("Starting Server");
					spawn('C:\\conanexiles\\ConanSandboxServer.exe', ['-log', 'MaxPlayers=50', 'Port=7777', 'QueryPort=5000', 'ServerName=[ME/AR] GG.NETWORK Arab Server 2x [AUTOUPDATE, Active Admins]'], { cwd: 'C:\\conanexiles' });
				}
			});
		}
	}, false);
	
}, 10 * 1000);

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
			
			if ( fs.existsSync('announcements.json') ) {
				announcements = JSON.parse(fs.readFileSync('announcements.json'));
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
				fs.writeFile('announcements.json', JSON.stringify(announcements), { flag: 'w' }, function(err) {
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
					console.log("Updating Server");
					var res = exec('C:\\SteamCMD\\steamcmd.exe +login anonymous +force_install_dir C:\\ConanExiles +app_update 443030 +quit');
					console.log(res);
				}, false);	
			}
			
		}
	});
},60 * 1000);