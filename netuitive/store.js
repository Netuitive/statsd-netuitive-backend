/*jshint node:true, laxcomma:true */

function Store() {
	this.store = {};
}

Store.prototype.add = function(element) {
	if (element) {
		if (this.find(element.id)) {
			return false;
		}
		this.store[element.id] = element;
		return true;
	}
	return false;
}

Store.prototype.find = function(id) {
	if (id && this.store.hasOwnProperty(id)) {
		return this.store[id];
	}
}

Store.prototype.values = function() {
	var values = [];
	for ( var id in this.store) {
		values.push(this.store[id]);
	}
	return values;
}

Store.prototype.clear = function() {
	this.store = {};
}

exports.Store = Store;