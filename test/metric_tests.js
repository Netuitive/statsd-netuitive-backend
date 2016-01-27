var metric = require('../netuitive/metric');

module.exports = {
    add_tag: function(test) {
        var m = new metric.Metric("cpu.idle");
        m.addTag("production", "true");
        test.expect(3);
        test.equal(1, m.tags.length);
        var t = m.tags[0];
        test.equals("production", t.name);
        test.equals("true", t.value);
        test.done();
    },

    add_multiple_tags_of_same_name: function(test) {
        var m = new metric.Metric("cpu.idle");
        m.addTag("production", "true");
        m.addTag("production", "false");
        test.expect(3);
        test.equal(1, m.tags.length);
        var t = m.tags[0];
        test.equals("production", t.name);
        test.equals("true", t.value);
        test.done();
    }
}
