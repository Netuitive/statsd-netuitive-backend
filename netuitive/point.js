/*jshint node:true, laxcomma:true */

function Point(key, val, timestamp) {
	this.key = key;
	this.val = val;
	this.timestamp = timestamp;
}

exports.Point = Point;