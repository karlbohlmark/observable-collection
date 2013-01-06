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

ObservableCollection.prototype.removeAll = function (fn, silent) {
	var toRemove = this.models.filter(fn);
	var collection = this;
	toRemove.forEach(function (item) {
		collection.remove(item, true);
	});
	if(!silent) this.emit('remove', toRemove);
};

ObservableCollection.prototype.remove = function (item, silent) {
	this.removeAt(this.models.indexOf(item), silent);
	if(!silent) this.emit('remove', item);
};

ObservableCollection.prototype.removeAt = function (index, silent) {
	var item =this.models[index];
	this.models.splice(index, 1);
	if(!silent) this.emit('remove', item);
};

module.exports = ObservableCollection;