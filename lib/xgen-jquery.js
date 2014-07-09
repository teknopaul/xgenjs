/*
 * Copyright teknopaul 2014 LGPL
 */

/**
 * XGenPath implementation for jQuery only.
 */

/**
 * Create XML content, and insert it as a child of the content element.
 * 
 * @param {string} xGenPath a xGen path string.
 * @return {XGenNodeList} The tail nodes, i.e. a list of all leaf nodes created
 * @public
 */
jQuery.prototype.create = function(xGenPath) {
	
	var tailNodes = [];

	var context;
	// Java style method overloading
	if (arguments.length === 0) {
		throw new Error("Missing xGenPath in create()");
	}
	
	var parsedPath = new XGenPath(xGenPath, true);
	
	var context = this;
	
 // In theory faster, in test not worth it, uncomment if you have very long paths or reflow perf issues
// 	if (parsedPath.length > 1) {
// 		context = [];
// 		for (var i = 0 ; i < this.length ; i++ ) {
// 			context.push(document.createElement("div"));
// 		}
// 	}
	
	this._createPath(context, parsedPath, tailNodes);
	
// 	if (parsedPath.length > 1) {
// 		for (var i = 0 ; i < this.length ; i++ ) {
// 			var generated = context[i].childNodes;
// 			for (var e = 0 ; e < generated.length ; e++ ) {
// 				this[i].appendChild(generated[e]);
// 			}
// 		}
// 	}
	
	return jQuery(tailNodes);
};

/**
 * Recursively add Elements to the document.
 * 
 * @param context  The nodelist to which more Elements are being added
 * @param xGenPath  The string expressions
 * @param tailNodes  An array of nodes returned to the client code
 */
jQuery.prototype._createPath = function(context, xGenPath, tailNodes) {

	var step = xGenPath.getStep();
	if (step == null) return;
	for (var i = 0 ; i < context.length ; i++) {
		var node = context[i];
		var generatedElements = this._createPathStep(node, step);
		this._createPath(generatedElements, xGenPath.next(), tailNodes);
		if (xGenPath.isTail()) {
			for (var g = 0 ; g < generatedElements.length ; g++) {
				tailNodes.push(generatedElements[g]);
			}
		}
	}
	
};

/**
 * Create one step in an xGen Path e.g. if path is /html/head/body{id=index}/div[3]
 * html, head and body are all steps
 * @param node parent node to the element being created
 * @param step step syntax is element or element{att:val} or element[n]
 * @return Array of generated nodes
 */
jQuery.prototype._createPathStep = function(node, step) {
	var generatedNodes = [];
	for (var i = 0; i < step.getArrayLength(); i++) {
		var element = document.createElement(step.getElement());
		node.appendChild(element);
		if (step.getAttributes() != null) {
			this._setAttributes(element, step.getAttributes());
		}
		generatedNodes.push(element);
	}
	return generatedNodes;
};

jQuery.prototype._setAttributes = function(elem, atts) {
	for (var key in atts) {
		elem.setAttribute(key, atts[key]);
	}
};

