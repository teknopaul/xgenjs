/*
 * Copyright teknopaul 2014 LGPL
 */

/**
 * NodeList is an Array with a length and an item(idx) method.
 *  
 * @constructor
 */
var XGenNodeList = function(xGen, nodeList) {
	
	this.xGen = xGen;
	/**
	 * @public
	 */
	this.length = 0;
	
	if (nodeList) this.addElements(nodeList);
	
};

/**
 * Factory method for node list containing only one node.
 * @static
 * @private
 */
XGenNodeList.createSingleNodeList = function(xGen, node) {
	var xGenNodeList = new XGenNodeList(xGen);
	xGenNodeList.add(node);
	return xGenNodeList;
};

/**
 * Make this compatible with DOM level 2 NodeList.
 * @returns {Element}
 * @public
 */
XGenNodeList.prototype.item = function(index) {
	return this[index];
};

// start - MutableNodeList, N.B. these do NOT change the DOM //

XGenNodeList.prototype.add = function(node) {
	if (typeof node === 'undefined') return;
	// magic to make this[0] work
	Array.prototype.push.call(this, node);
};

XGenNodeList.prototype.addElements = function(nodeList) {
	// DOM nodeList
	if (nodeList.item) {
		for (var i = 0 ; i < nodeList.length ; i++) {
			Array.prototype.push.call(this, nodeList.item(i));
		}
	}
	// xPath array or jQuery (TODO fix this so XPath returns proper NodeLists)
	else if (nodeList.length) {
		for (var i = 0 ; i < nodeList.length ; i++) {
			Array.prototype.push.call(this, nodeList[i]);
		}
	}
};

// end - MutableNodeList //

// start DOM Mutations //

/**
 * Accepts a single string argument, in which case the same string is used for each node.
 * or multiple strings in which case the number of arguments should match
 * the number of nodes in the list.
 * @param {string} varargs
 * @return {XGenNodeList}
 * @public
 */
XGenNodeList.prototype.setTextContent = function() {
	for (var i = 0 ; i < this.length ; i++) {
		var node = this[i];
		var string = "";
		if (arguments.length === 1) {
			string = arguments[0];
		}
		else {
			string = arguments[i];
		}
		var textNode = this.xGen.document.createTextNode(string);
		node.appendChild(textNode);
	} 
	return this;
};

/**
 * Adds an attribute to each node in the list.
 * @return {XGenNodeList}
 * @public
 */
XGenNodeList.prototype.setAttribute = function(name, value) {
	for (var i = 0 ; i < this.length ; i++) {
		var node = this[i];
		node.setAttribute(name, value);
	}
	return this;
};

/**
 * Adds a different attribute to each node in the list.
 * 
 * Accepts an array of objects to be set as attributes
 * create("div/ul/li[4]").setAttributes([
 *   { class : "odd selected", id : "main-menu" },
 *   { class : "even" },
 *   { class : "odd"  },
 *   { class : "even" },
 * ]);
 * 
 * or an array of length one in which case the same attributes
 * are added to each node in the list.
 * @return {XGenNodeList}
 * @public
 */
XGenNodeList.prototype.setAttributes = function(arr) {
	for (var i = 0 ; i < this.length ; i++) {
		var node = this[i];
		var idx = arr.length > 1 ? i : 0;
		var atts = arr[idx];
		for (var att in atts) {
			node.setAttribute(att, atts[att]);
		}
	}
	return this;
};

/**
 * Appends a clone of the supplied node to each node in the list.
 * @param {Element} DOM node to clone
 * @return {XGenNodeList}
 * @public
 */
XGenNodeList.prototype.appendChild = function(newChild) {
	var tailNodes = new XGenNodeList(this.xGen);
	for (var i = 0 ; i < this.length ; i++) {
		var node = this[i];
		var clone = newChild.cloneNode(true);
		node.appendChild(clone);
		tailNodes.add(clone);
	}
	return tailNodes;
};

/**
 * Calls a function for each node in the list.
 * 
 * The function should typically return the node it is given 
 * to allow continuation, it may also return new nodes created.
 * It may return nothing to filter the list.
 * 
 * @param function which is supplied the node as an argument.
 * @return {XGenNodeList} tailnodes if any nodes are created.
 * @public
 */
XGenNodeList.prototype.each = function(lambda) {
	var tailNodes = new XGenNodeList(this.xGen);
	for (var i = 0 ; i < this.length ; i++) {
		tailNodes.add(lambda(this[i], this.xGen));
	}
	return tailNodes;
};

/**
 * Create elements based on an xGenPAth for each node in the list.
 * @return {XGenNodeList}
 * @public
 */
XGenNodeList.prototype.create = function(xGenPath) {
	return this.xGen.create(this, xGenPath);
};

/**
 * Select nodes starting from each node in the list.
 * select() uses XPaths of CSS Selectors depending on the runtime context, web or nodejs.
 * @return {XGenNodeList}
 * @public
 */
XGenNodeList.prototype.select = function(xPath) {
	var xGenNodeList = new XGenNodeList(this.xGen);
	for (var i = 0 ; i < this.length ; i++) {
		var node = this[i];
		xGenNodeList.addElements(this.xGen.select(node, xPath));
	}
	return xGenNodeList;
};

//ifdef NODEJS
if (typeof module !== 'undefined' && module.exports) {
	module.exports.XGenNodeList = XGenNodeList;
}
//endif
