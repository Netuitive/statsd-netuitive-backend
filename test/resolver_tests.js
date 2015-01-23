var resolver = require('../netuitive/Resolver')

module.exports = {
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
	resolve_multi_captured_groups_returns_expected_value: function(test) {
		test.expect(1);
		var r = new resolver.Resolver("Server!(.*?)!cpu!(.*)");
		var resolved = r.resolve("Server!foo!cpu!0", "$2-$1");
		test.equal("0-foo", resolved);
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