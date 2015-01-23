var mapper = require('../netuitive/mapper');
var point = require('../netuitive/point');

module.exports = {
	process_returns_expected_element: function(test) {
		test.expect(11);
		var config = {
			apiKey: "YOUR_API_KEY",
			mappings: [
				{
					pattern: "Server!(.*?)!(.*)",
					element: {
						type: "Server",
						name: "$1",
						metric: {
							name: "$2"
						}
					}
				}
			]
		};
		var m = new mapper.Mapper(config);
		var p = new point.Point("Server!foo!cpu.idle", 92.3, 1411395240000);
		m.process(p);
		var elements = m.elements();
		test.equal(1, elements.length);
		var e = elements[0];
		test.equal("foo", e.name);
		test.equal("Server", e.type);
		test.equal("Server!foo", e.id);
		
		test.equal(1, e.metrics.length);
		var metric = e.metrics[0];
		test.equal("cpu.idle", metric.id);
		test.equal("cpu.idle", metric.name);

		test.equal(1, e.samples.length);
		var sample = e.samples[0];
		test.equal("cpu.idle", sample.metricId);
		test.equal(1411395240000000, sample.timestamp);
		test.equal(92.3, sample.val);
		test.done();
	}
}