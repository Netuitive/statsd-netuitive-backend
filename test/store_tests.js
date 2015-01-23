var store = require('../netuitive/Store')
var element = require('../netuitive/Element')

module.exports = {
	find_returns_expected_values: function(test) {
		test.expect(1);
		var s = new store.Store();
		var e = new element.Element("Server", "foo");
		s.add(e)
		var found = s.find("Server!foo");
		test.equal(e, found);
		test.done();
	},
	values_returns_all_elements: function(test) {
		test.expect(1);
		var s = new store.Store();
		var e1 = new element.Element("Server", "foo");
		var e2 = new element.Element("Server", "bar");
		s.add(e1);
		s.add(e2);
		test.equal(2, s.values().length);
		test.done();
	},
	clear_empty_the_store: function(test) {
		test.expect(2);
		var s = new store.Store();
		var e = new element.Element("Server, foo");
		s.add(e);
		test.equal(1, s.values().length);
		s.clear();
		test.equal(0, s.values().length);
		test.done();
	},
	add_duplicate_element_returns_false: function(test) {
		test.expect(3);
		var s = new store.Store();
		var e1 = new element.Element("Server", "foo");
		var e2 = new element.Element("Server", "foo");
		test.ok(s.add(e1));
		test.ok(!s.add(e2));
		test.equal(e1, s.find("Server!foo"));
		test.done();
	}
}