#!/usr/bin/env node

var favicon = require('./favicon');
var argv = process.argv.slice(2)

if (argv.length >= 1) {
	for (var i in argv) {
		var arg = argv[i];
    favicon.get(arg, function(err, url) {
        console.log(url);
    });
	}
} else {
	console.log('Please supply at least 1 argument.');
}