/*
 * Copyright teknopaul 2014 LGPL
 */

//ifdef NODEJS
// gubbins for the compiler checks
// TODO jshint is better
if ( ! XGen) var XGen = function(){};
if ( ! XGenFactory) var XGenFactory = function(){};
if ( ! XGenNodeList) var XGenNodeList = function(){};
if ( ! window) var window = {};
//endif

/**
 * Code that is only useful in a browser
 */

XGen.newXmlDocument = function() {
	
	return window.document.implementation.createDocument(null, null, null);
	
};

// IE DOMParser polyfil
if ( ! window.DOMParser) {
	var DOMParser = function() {
	};
	
	DOMParser.prototype.parseFromString = function(xml) {
		var xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
		xmlDoc.async = false; 
		xmlDoc.loadXML(xml);
		return xmlDoc;
	};
};

if (typeof $ === 'function' && jQuery === $) {
	/**
	 * jQuerify this nodelist
	 * e.g. 
	 * ...
	 * .create("p/ul/li[5]").$().hide();
	 */
	XGenNodeList.prototype.$ = function() {
		return $(this);
	};
	/**
	 * Use jQuery for querySelectorAll() since it supports IE6 and fixes bugs in
	 * other IE versions.
	 * @param context
	 * @param querySelector
	 * @returns {XGenNodeList}
	 */
	XGen.prototype._selectQuerySelector = function(context, querySelector) {
		var nodeList = $(querySelector, context);
		return new XGenNodeList(this, nodeList);
	};
	
	/**
	 * Default xGen instance for use by jQuery
	 */
	jQuery.xGen = new XGen(window.document).configure();
	
	/**
	 * Add XGen.create() function to jQuery objects.
	 * @param xGenPath
	 * @returns
	 * @public
	 */
	jQuery.prototype.create = function(xGenPath) {
		return $(jQuery.xGen.create(this, xGenPath));
	};
}
