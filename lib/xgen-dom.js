/*
 * Copyright teknopaul 2014 LGPL
 */

/**
 * XGenPath implementation for creating DOM elements.
 * 
 * NodeJS version uses..
 * 'xmldom' (https://github.com/jindw/xmldom) which is a DOM Level 2 compliant API
 * and 
 * 'xpath' (https://github.com/goto100/xpath)
 * 
 * Other DOM Level to docs are supported by creating them and suppling the created doc 
 * as an argument to the XGenFactory.newInstance() method.
 * If you do that creating XML with full XML strings is not supported 
 * i.e.  create("<xml/>")  will throw an Error.
 * 
 * This implementation should also work in a browser.
 */

//ifdef NODEJS
if (typeof module !== 'undefined' && module.exports) {
	
	var XGenPath = require('./xgen-path.js').XGenPath;
	var XGenNodeList = require('./xgen-nodelist.js').XGenNodeList;
	try {
		var DOMImplementation = require('xmldom').DOMImplementation;
		var DOMParser = require('xmldom').DOMParser;
		var XMLSerializer = require('xmldom').XMLSerializer;
	} catch(err) {
		// Optional dependency
	}
	try {
		var xpath = require('xpath');
	} catch (err) {
		// Optional dependency
	}
	
}
//endif


/**
 * Create an XGen instance passing a document or a DOMImplementation that can create a new document.
 * If the constructor arg is missing DOMImplementation must be available in the current scope.
 * @param {DOMImplementation|Document|Element|undefined}
 * @constructor
 * @public
 */
var XGen = function(arg) {
	/**
	 * @public
	 */
	this.document = null;
	// var DOMImplementation = require('somedomlevel2module').DOMImplementation;
	// new XGen()
	if (typeof arg === 'undefined' && DOMImplementation) {
		this.document = new DOMImplementation().createDocument();
	}
	// new XGen(domImplementation)
	else if (arg.createDocument) {
		this.document = arg.createDocument();
	}
	// new XGen(window.document)
	else if (arg.documentElement && arg.documentElement.nodeName === 'HTML' && arg.title) {
		this.document = arg;
	}
	// new XGen(doc)  // client created the document themselves
	else if (arg.createElement) {
		this.document = arg;
	}
	else {
		throw new Error("Unsupported constructor " + arg);
	}
	
	this.outputEncoding = "UTF-8"; // TODO
	this.outputIndent = "yes";     // TODO
	this.outputMethod = "xml";     // TODO
	this.selectMode = XGen.QRY_MODE_XPATH;
};

/** 
 * Select with XPaths, works if require('xpath') does.
 * @constant
 * @public
 */
XGen.QRY_MODE_XPATH = 1;
/** 
 * Select with CSS Selectors, jQuery style, works in a web page.
 * @constant
 * @public
 */
XGen.QRY_MODE_SELECTOR = 2;

/**
 * @param {object} Configuration object
 * @public
 */
XGen.prototype.configure = function(options) {
	if ( ! options) {
		if (typeof window !== 'undefined' && typeof window.document !== 'undefined') {
			this.selectMode = XGen.QRY_MODE_SELECTOR;
			this.outputMethod = "html";
			return this;
		}
		options = {};
	} 
	this.outputEncoding = options.outputEncoding || "UTF-8";
	this.outputIndent = options.outputIndent || "yes";
	this.outputMethod = options.outputMethod || "xml";
	this.selectMode = options.selectMode || XGen.QRY_MODE_XPATH;
	return this;
};

/**
 * Create a new document populated with elements form the xGenPath.
 * The path must be absolute, i.e. it must start with a / and it must have a single root
 * element, this is a requirement of XML. The root may have attributes.
 * This method should be called only once per lifetime of the XGen instance.
 * 
 * @param {string} xGenPath 
 * @return {XGenNodeList} List of tail nodes created.
 * @public
 */
XGen.prototype.newDocument = function(xGenPath) {
	if (this.getRoot() !== null) {
		throw new Error("Document already exists");
	}
	if ( xGenPath.charAt(0) !== "/") {
		throw new Error("New document needs an absolute path to start");
	}
	var parsedGenPath = new XGenPath(xGenPath.substring(1), this._dotIsClass());
	if ( parsedGenPath.getStep().getArrayLength() != 1 ) {
		throw new Error("Must be only one root element");
	}
	var root = this.document.createElement(parsedGenPath.getStep().getElement());
	var atts = parsedGenPath.getStep().getAttributes();
	if (atts != null) {
		this._setAttributes(root, atts);
	}
	this.document.appendChild(root);
	
	var tailNodes = new XGenNodeList(this);
	var context = XGenNodeList.createSingleNodeList(this, root);
	this._createPath(context, parsedGenPath.next(), tailNodes);
	if (tailNodes.length == 0) {
		tailNodes.add(root);
	}
	return tailNodes;
};

/**
 * @return {Element} The root element of the document being created.
 * @public
 */
XGen.prototype.getRoot = function() {
	return this.document.documentElement;
};

// Core XML creation methods

/**
 * Create XML content, and insert it as a child of the content element.
 * 
 * @param {NodeList} elem where to insert the new elements, may be ommitted
 * @param {string} xGenPath a xGen path string, or a whole parseable XML doc as a string.
 * @return {XGenNodeList} The tail nodes, i.e. a list of all leaf nodes created
 * @public
 */
XGen.prototype.create = function(/*[context], xGenPath*/) {
	var tailNodes = new XGenNodeList(this);
	
	var xGenPath; 
	var context;
	// Java style method overloading
	if (arguments.length === 0) {
		throw new Error("Missing xGenPath in create()");
	}
	if (arguments.length === 1) {
		xGenPath = arguments[0];
		context = XGenNodeList.createSingleNodeList(this, this.getRoot());
	}
	else {
		xGenPath = arguments[1];
		context = new XGenNodeList(this);		
		context.addElements(arguments[0]);
	}
	
	this._create(context, xGenPath, tailNodes);
	return tailNodes;
};

/**
 * Select nodes using the configures path type css selectors or XPaths.
 * @return  {XGenNodeList}
 * @public
 */
XGen.prototype.select = function(/* [context], xPath*/) {
	var path;
	var context;
	// Java style method overloading
	if (arguments.length === 0) {
		throw new Error("Missing path in select()");
	}
	if (arguments.length === 1) {
		path = arguments[0];
		context = this.getRoot();
	}
	else {
		path = arguments[1];
		context = arguments[0];
	}
	
	if (this.selectMode === XGen.QRY_MODE_SELECTOR) {
		return this._selectQuerySelector(context, path);
	}
	else if (this.selectMode === XGen.QRY_MODE_XPATH) {
		return this._selectXPath(context, path);
	}
	else {
		return this._selectXPath(context, path);
	}
};

/**
 * @returns {string} Stringified XML
 * @public N.B. output is browser specific, actual output depends on the configured renderer.
 */
XGen.prototype.serialize = function(indent) {
	var xmlSerializer = indent ? new XMLSerializer2() : new XMLSerializer();
	xmlSerializer.indent = indent;
	return xmlSerializer.serializeToString(this.document);
};

/**
 * 
 * @param context
 * @param xPath
 * @returns {XGenNodeList}
 */
XGen.prototype._selectXPath = function(context, xPath) {
	var nodeList = xpath.select(xPath, context);
	return new XGenNodeList(this, nodeList);
};
/**
 * 
 * @param context
 * @param xPath
 * @returns {XGenNodeList}
 */
XGen.prototype._selectQuerySelector = function(context, querySelector) {
	var nodeList = context.querySelectorAll(querySelector);
	return new XGenNodeList(this, nodeList);
};

/**
 * This method should be the only method that calls Element generation if
 * parsing XML is also required. 
 * 
 * @param context  The nodelist to which more Elements are being added
 * @param xGenPath  The string expressions
 * @param tailNodes  A list of nodes returned to the client code
 */
XGen.prototype._create = function(context, xGenPath, tailNodes) {
	// hackety ho hum
	if (xGenPath.charAt(0) === "<") {
		this._insert(context, xGenPath);
	} else {
		var parsedPath = new XGenPath(xGenPath, this._dotIsClass());
		// Opportunity to optimize here, perf test before optimizing,
		// in theory DOM manipulation in browsers is slow
		//if (parsedPath.length > 1) {
		//	var origContext = context;
		//	context = this._createFragments(origContext);
		//} 
		this._createPath(context, parsedPath, tailNodes);
		//if (parsedPath.length > 1) {
		//	this._attachFragments(origContext, context);
		//}
	}
};

/**
 * Recursively add Elements to the document.
 * 
 * @param context  The nodelist to which more Elements are being added
 * @param xGenPath  The string expressions
 * @param tailNodes  A list of nodes returned to the client code
 */
XGen.prototype._createPath = function(context, xGenPath, tailNodes) {

	var step = xGenPath.getStep();
	if (step == null) return;
	for (var i = 0 ; i < context.length ; i++) {
		var node = context.item(i);
		var generatedElements = this._createPathStep(node, step);
		this._createPath(generatedElements, xGenPath.next(), tailNodes);
		if (xGenPath.isTail()) {
			tailNodes.addElements(generatedElements);
		}
	}
	
};

/**
 * Recursively add a whole block of XML to the nodes.
 * @param context  The nodelist to which more Elements are being added
 * @param xml A string of XML
 */
XGen.prototype._insert = function(context, xml) {
	var doc = new DOMParser().parseFromString(xml, 'application/xml');
	for (var i = 0 ; i < context.length ; i++) {
		var nextNode = context.item(i);
		nextNode.appendChild(doc.documentElement.cloneNode(true));
	}
};

/**
 * Create one step in an xGen Path e.g. if path is /html/head/body{id=index}/div[3]
 * html, head and body are all steps
 * @param node parent node to the element being created
 * @param step  step syntax is element or element{att:val} or element[n]
 * @return {XGenNodeList}
 */
XGen.prototype._createPathStep = function(node, step) {
	var generatedNodes = new XGenNodeList(this);
	for (var i = 0; i < step.getArrayLength(); i++) {
		var element = this.document.createElement(step.getElement());
		node.appendChild(element);
		if (step.getAttributes() != null) {
			this._setAttributes(element, step.getAttributes());
		}
		generatedNodes.add(element);
	}
	return generatedNodes;
};

XGen.prototype._setAttributes = function(elem, atts) {
	for (var key in atts) {
		elem.setAttribute(key, atts[key]);
	}
};

XGen.prototype._dotIsClass = function() {
	return "html" === this.outputMethod;
};

//ifdef NODEJS
if (typeof module !== 'undefined' && module.exports) {
	module.exports.XGen = XGen;
}
//endif
