/*jshint node:true, laxcomma:true */

var store = require('./store');
var element = require('./element');
var metric = require('./metric');
var resolver = require('./resolver');

function Mapper(config) {
	this.config = config;
	this.store = new store.Store();
}

Mapper.prototype.process = function(point) {
	var key = point.key;
	for (var idx = 0; idx < this.config.mappings.length; idx++) {
		var mapping = this.config.mappings[idx];
		var pattern = new RegExp(mapping.pattern);
		if (!pattern.test(key)) {
			continue;
		}

		var r = new resolver.Resolver(mapping.pattern);
		var e = new element.Element(mapping.element.type, r.resolve(key, mapping.element.name));
		this.store.add(e);
		e = this.store.find(e.id);
		var m = e.findOrCreateMetric(new metric.Metric(r.resolve(key, mapping.element.metric.name)));
        if (mapping.element.metric.tags) {
            for (var idx = 0; idx < mapping.element.metric.tags.length; idx++) {
                var tag = mapping.element.metric.tags[idx];
                m.addTag(r.resolve(key, tag.name), r.resolve(key, tag.value));
            }
        }
		e.addSample(point.timestamp, m.id, point.val);
	}
}

Mapper.prototype.elements = function() {
	return this.store.values();
}

exports.Mapper = Mapper;