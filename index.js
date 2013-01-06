var Collection = require('collection');
var Emitter = require('emitter');

function ObservableCollection (items) {
	Collection.call(this, items);
	this.on('add', this.triggerChange.bind(this));
	this.on('remove', this.triggerChange.bind(this));
}

ObservableCollection.prototype = Object.create(Collection.prototype);
ObservableCollection.prototype.constructor = ObservableCollection;

var merge = function (a, b) {
	Object.keys(b).forEach(function (key) {
		a[key] = b[key];
	});
};

merge(ObservableCollection.prototype, Emitter.prototype);

ObservableCollection.prototype.triggerChange = function () {
	this.emit('change');
};

ObservableCollection.prototype.push = function (item) {
	Collection.prototype.push.call(this, item);
	this.emit('add', item);
};

ObservableCollection.prototype.removeAll = function (fn) {
	var toRemove = this.models.filter(fn);
	toRemove.forEach(this.remove.bind(this));
};

ObservableCollection.prototype.remove = function (item) {
	this.removeAt(this.models.indexOf(item));
};

ObservableCollection.prototype.removeAt = function (index) {
	this.models.splice(index, 1);
	this.emit('remove', toRemove);
};

module.exports = ObservableCollection;