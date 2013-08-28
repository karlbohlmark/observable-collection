var Collection = require('collection');
var Emitter = require('emitter');

function ObservableCollection (items) {
	Collection.call(this, items);
	this.on('add', this.triggerChange.bind(this));
	this.on('remove', this.triggerChange.bind(this));
	this.on('replace', this.triggerChange.bind(this));
	this.on('move', this.triggerChange.bind(this));
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
	var len = Collection.prototype.push.call(this, item);
	this.emit('add', item, len - 1);
};

ObservableCollection.prototype.replaceAt = function (index, newItem) {
	var oldItem = this.models[index]
	this.models[index] = newItem
	this.emit('replace', index, oldItem, newItem);
};

ObservableCollection.prototype.move = function (fromIndex, toIndex) {
	var item = this.models[fromIndex]
	var newLocationItem = this.models[toIndex]
	this.models.splice(fromIndex, 1)
	this.models.splice(toIndex, 0, item)
	this.emit('move', fromIndex, toIndex, item, newLocationItem);
};

ObservableCollection.prototype.removeAll = function (fn, silent) {
	var toRemove = this.models.filter(fn);
	var collection = this;
	toRemove.forEach(function (item) {
		collection.remove(item, true);
	});
};

ObservableCollection.prototype.remove = function (item, silent) {
	var index = this.models.indexOf(item)
	if (index !== -1) {
		this.removeAt(index, silent);
	}
};

ObservableCollection.prototype.removeAt = function (index, silent) {
	var item =this.models[index];
	this.models.splice(index, 1);
	if(!silent) this.emit('remove', item, index);
};

module.exports = ObservableCollection;