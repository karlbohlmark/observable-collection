var Collection = require('collection');
var Emitter = require('emitter');

function ObservableCollection (items) {
	Collection.call(this, items);
}

ObservableCollection.prototype = Object.create(Collection.prototype);
ObservableCollection.prototype.constructor = ObservableCollection;

var merge = function (a, b) {
	Object.keys(b).forEach(function (key) {
		a[key] = b[key];
	});
};

merge(ObservableCollection.prototype, Emitter.prototype);

ObservableCollection.prototype.push = function (item) {
	Collection.prototype.push.call(this, item);
	this.emit('change');
};


ObservableCollection.prototype.remove = function (fn) {
	var models = this.models;
	var toRemove = this.models.filter(fn);
	toRemove.forEach(function (it) {
		models.splice(models.indexOf(it), 1);
	});
	this.emit('change');
};

module.exports = ObservableCollection;