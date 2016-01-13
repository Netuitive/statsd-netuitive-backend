/*jshint node:true, laxcomma:true */

function Metric(id) {
    this.id = id;
    this.name = id;
    this.tags = [];
}

exports.Metric = Metric;

Metric.prototype.addTag = function(name, value) {
    if (this.tags.filter(function(t) {return t.name == name}).length == 0) {
        this.tags.push({"name": name, "value": value});
    }
}