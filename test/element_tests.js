var element = require('../netuitive/Element')

module.exports = {
	constructor_sets_element_name_type_id: function(test) {
		test.expect(3);
		var e = new element.Element("Server", "foo");
		test.equal("Server", e.type);
		test.equal("foo", e.name);
		test.equal("Server!foo", e.id);
		test.done();
	},
	add_metric_append_metric_sample: function(test) {
		test.expect(7);
		var e = new element.Element("Server", "foo");
		e.addMetric(1411395240000, "cpu.idle", 92.3);
		test.equal(1, e.metrics.length);
		test.equal(1, e.samples.length);

		var metric = e.metrics[0];
		test.equal("cpu.idle", metric.id);
		test.equal("cpu.idle", metric.name);

		var sample = e.samples[0];
		test.equal("cpu.idle", sample.metricId);
		test.equal(1411395240000000, sample.timestamp);
		test.equal(92.3, sample.val);
		test.done();
	},
	add_multiple_samples_of_same_metric: function(test) {
		test.expect(4);
		var e = new element.Element("Server", "foo");
		e.addMetric(1411395240000, "cpu.idle", 92.3);
		e.addMetric(1411395240000, "cpu.idle", 82.3);
		test.equal(1, e.metrics.length);
		test.equal(2, e.samples.length);

		var metric = e.metrics[0];
		test.equal("cpu.idle", metric.id);
		test.equal("cpu.idle", metric.name);
		test.done();
	}
}