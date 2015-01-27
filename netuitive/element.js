/*jshint node:true, laxcomma:true */

function Element(type, name) {
	this.type = type;
	this.name = name;
	this.id = name;
	this.metrics = [];
	this.samples = [];
	this.attributes = [];
}


Element.prototype.addMetric = function(timestamp, metric, value) {
	if (this.metrics.filter(function(m){return m.id == metric}).length == 0) {
		this.metrics.push({"id": metric, "name": metric});
	}
	this.samples.push({"metricId": metric, "timestamp": timestamp * 1000, "val": value});
}

exports.Element = Element;