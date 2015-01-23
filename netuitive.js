/*jshint node:true, laxcomma:true */

/*
* Flush stats to netuitive (http://www.netuitive.com).
*/

var mapper = require('./netuitive/mapper');
var point = require('./netuitive/point');
var http = require('http');
var https = require('https');

function NetuitiveBackend(startup_time, config, events, logger) {
	this.config = config.netuitive;
	this.logger = logger;
	this.debug = this.config.debug;

	this.apiHost = this.config.apiHost ? this.config.apiHost : "api.app.netuitive.com";
	this.apiPort = this.config.apiPort ? this.config.apiPort : 443;
	this.protocol = this.config.http ? http : https; 
	this.status = {};

	var self = this;
	events.on('flush', function(time_stamp, metrics) {
		self.flush(time_stamp, metrics);
	});

	events.on('status', function(writeCb) {
		self.status(writeCb);
	});
}

NetuitiveBackend.prototype.validate = function() {
	var config = this.config;
	if (!config) {
		this.log("missing netuitive config in StatsD configuration file", "ERROR");
		return false;
	}

	if (!config.apiKey) {
		this.log("missing netuitive apiKey", "ERROR");
		return false;
	}

	if (!config.mappings || config.mappings.length < 1) {
		this.log("mappings is required and need at least one mapping", "ERROR");
		return false;
	}

	return true;
}

NetuitiveBackend.prototype.post = function(message) {
	if (!message) {
		this.log("empty message", "WARN");
		return;
	}

	var payload = JSON.stringify(message);

	var options = {
		host: this.apiHost,
		port: this.apiPort,
		path: '/ingest/statsd/' + this.config.apiKey,
		method: 'POST',
		headers: {
			"Content-Length": payload.length,
			"Content-Type": "application/json; charset=utf-8",
			"User-Agent": "statsd-netuitive-backend"
		}
	};

	if (this.debug) {
		this.log("payload to post:", "DEBUG");
		this.log(payload);
	}

	var self = this;
	var req = this.protocol.request(options, function(res) {
		if (self.debug) {
			self.log("statusCode: " + res.statusCode, "DEBUG");
			self.log("headers: " + JSON.stringify(res.headers), "DEBUG");
		}

		if (res.statusCode !== 200) {
			self.log("error occurred during post, statusCode:" + res.statusCode, "WARN");
		}
	});

	req.write(payload);
	req.end();

	req.on('error', function(e) {
		self.log(e, "ERROR");
	});

}

NetuitiveBackend.prototype.log = function(msg, type) {
	this.logger.log("[netuitive] " + msg, type);
}

NetuitiveBackend.prototype.flush = function(timestamp, metrics) {
	if (this.debug) {
		this.log("start flusing stats for timestamp: " + new Date(timestamp*1000), "DEBUG");
	}

	var m = new mapper.Mapper(this.config);
	var key,val,p;
	for (key in metrics.counters) {
		 val = metrics.counters[key];
		 p = new point.Point(key + '.counter', val, timestamp);
		 m.process(p);
	}

	for (key in metrics.gauges) {
		val = metrics.gauges[key];
		if (!isNaN(parseFloat(val)) && isFinite(val)) {
			p = new point.Point(key + '.gauge', val, timestamp);
			m.process(p);
		}
	}

	for (key in metrics.timer_data) {
		var timerMetrics = metrics.timer_data[key];
		for (var timerKey in timerMetrics) {
			val = timerMetrics[timerKey];
			p = new point.Point(key + '.timer.' + timerKey, val, timestamp);
			m.process(p);
		}
	}

	var elements = m.elements();

	this.post(elements);

	this.status['lastFlush'] = Math.round(new Date().getTime() / 1000);
}

NetuitiveBackend.prototype.status = function(writeCb) {
	for (var s in this.status) {
		writeCb(null, 'Netuitive', s, status[s]);
	}
}

exports.init = function(startup_time, config, events, logger) {
	var backend = new NetuitiveBackend(startup_time, config, events, logger);
	return backend.validate();
}


