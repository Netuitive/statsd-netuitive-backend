/*jshint node:true, laxcomma:true */

function Resolver(regex) {
	this.regex = new RegExp(regex);
}

Resolver.prototype.resolve = function(key, expression) {
	if (!expression) return "";
	var groups = key.match(this.regex);
	var literals = expression.split(/\$\d+/);
	var indices = [];
	var pattern = /\$(\d+)/g;

	var result;
	var index = 0;
	while ((result = pattern.exec(expression)) != null) {
		indices[index++] = result[1];
	}

	var resolved = "";
	if (indices.length == 0) {
		resolved = expression;
	} else {
		var max = Math.max.apply(Math, indices);
		var min = Math.min.apply(Math, indices);
		if (min < 1 || max >= groups.length) {
			throw new Error("captured group out of range");
		}
		for (var idx = 0; idx < indices.length; idx++) {
			resolved += literals[idx] + groups[indices[idx]];
		}
	}
	return resolved;
}

exports.Resolver = Resolver;