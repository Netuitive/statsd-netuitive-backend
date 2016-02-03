var resolver = require('../netuitive/resolver');

module.exports = {
	resolve_null_returns_empty_string: function(test) {
		test.expect(1);
		var r = new resolver.Resolver("Server!(.*)");
		var resolved = r.resolve("Server!foo", null);
		test.equal("", resolved);
		test.done();
	},
	resolve_literal_returns_expected_value: function(test) {
		test.expect(1);
		var r = new resolver.Resolver("Server!(.*)");
		var resolved = r.resolve("Server!foo", "bar");
		test.equal("bar", resolved);
		test.done();
	},
	resolve_captured_group_returns_expected_value: function(test) {
		test.expect(1);
		var r = new resolver.Resolver("(.*?ana.*?)\\.(.*?\\.mean)\\.gauge");
		var resolved = r.resolve("dev-analysis.queue.job.notebookSaveMillis.snapshot.mean.gauge", "$1");
		test.equal("dev-analysis", resolved);
		test.done();
	},
	resolve_captured_group_prepend_literal_returns_expected_value: function(test) {
		test.expect(1);
		var r = new resolver.Resolver("Server!(.*)");
		var resolved = r.resolve("Server!foo", "statsd-$1");
		test.equal("statsd-foo", resolved);
		test.done();
	},
	resolve_captured_group_append_literal_returns_expected_value: function(test) {
		test.expect(1);
		var r = new resolver.Resolver("Server!(.*)");
		var resolved = r.resolve("Server!foo", "$1-statsd");
		test.equal("foo-statsd", resolved);
		test.done();
	},
	resolve_multi_captured_groups_returns_expected_value: function(test) {
		test.expect(1);
		var r = new resolver.Resolver("Server!(.*?)!cpu!(.*)");
		var resolved = r.resolve("Server!foo!cpu!0", "$2-$1");
		test.equal("0-foo", resolved);
		test.done();
	},
	resolve_multi_captured_groups_and_prepend_append_liternals_returns_expected_value: function(test) {
		test.expect(1);
		var r = new resolver.Resolver("Server!(.*?)!cpu!(.*)");
		var resolved = r.resolve("Server!foo!cpu!0", "prepend-$2-$1-append");
		test.equal("prepend-0-foo-append", resolved);
		test.done();
	},
	resolve_invalid_captured_group_throws_error: function(test) {
		var r = new resolver.Resolver("Server!(.*)");
		test.throws(function() {
			r.resolve("Server!foo", "$2");
		});
		test.done();
	}

}