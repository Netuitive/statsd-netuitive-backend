/*jshint node:true, laxcomma:true */

function Element(type, name) {
	this.type = type;
	this.name = name;
	this.id = name;
	this.metrics = [];
	this.samples = [];
	this.attributes = [];
}

Element.prototype.addSample = function(timestamp, metricId, value) {
	this.samples.push({"metricId": metricId, "timestamp": timestamp * 1000, "val": value});
}

Element.prototype.findOrCreateMetric = function(metric) {
	for(var idx = 0; idx < this.metrics.length; idx++) {
		if (this.metrics[idx].id == metric.id) {
			return this.metrics[idx];
		}
	}
	this.metrics.push(metric);
	return metric;
}

exports.Element = Element;