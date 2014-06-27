/*
 * Copyright teknopaul 2014 LGPL
 */

/**
 * Parser and container for parsed xGenPaths
 * that define XML elements to be created.
 * 
 * @private There is no  need to expose this and there are optimizations possible
 *  by refactoring internal path handling so this is marked private, from a http://semver.org point of view.
 *  It can be used independently of the rest of XGen if required.
 * 
 * @constructor
 */
var XGenPath = function(xGenPath, dotIsClass) {
	this._position = 0;
	this._steps = [];
	this._xGenPath = xGenPath;
	this._dotIsClass = typeof dotIsClass == 'undefined' ? true : dotIsClass;
	// xGenPath is null when created by next()
	if (xGenPath) {
		var steps = xGenPath.split("/");
		for (var step in steps) {
			this._steps.push(new XGenPathStep(steps[step], this._dotIsClass));
		}
	}
};

XGenPath.prototype.getStep = function() {
	if (this._position >= this._steps.length) {
		return null;
	}
	return this._steps[this._position];
};

/**
 * @return returns a new Path that is one step shorter.
 */
XGenPath.prototype.next = function() {
	var newPath = new XGenPath(null, this.dotIsClass);
	newPath._position = this._position + 1;
	newPath._steps = this._steps;
	return newPath;
};

/**
 * @return return true if this is the last segment of a path
 */
XGenPath.prototype.isTail = function() {
	return this._position == this._steps.length - 1;
};



// PATH STEPS
/**
 * @constructor
 */
var XGenPathStep = function(step, dotIsClass) {
	/**
	 * Name of the element to be created
	 */
	this.element;
	/**
	 * Attributes to be created, or null
	 */
	this.attributes = null;
	/**
	 * Number of elements to create
	 */
	this.arrayLength = 1;
	
	this.parse(step, dotIsClass);
	
	if (this.element === null || this.element === "") {
		throw new Error("Element name missing in step");
	}
	
};

XGenPathStep.prototype.parse = function(step, dotIsClass) {
	// parse backwards
	var stepPart = step;
	
	// chop off array suffix
	if (step.lastIndexOf("]") === step.length - 1) {
		// TODO if [ missing throw XGenSyntaxException
		var arraySize = stepPart.substring(stepPart.lastIndexOf('[') + 1, stepPart.lastIndexOf(']'));
		try {
			this.arrayLength = parseInt(arraySize);
		} catch (err) {
			throw new Error("Array index invalid parsing step " + step);
		}
		stepPart = stepPart.substring(0, step.lastIndexOf('['));
	}
	
	// chop off attributes
	if (stepPart.lastIndexOf("}") === step.length - 1) {
		// TODO if { missing throw XGenSyntaxException
		this.attributes = {}; 
		var attsString = stepPart.substring(stepPart.lastIndexOf('{') + 1, stepPart.lastIndexOf('}'));
		stepPart = stepPart.substring(0, step.lastIndexOf('{'));
		// for now no escapeing
		var atts = attsString.split(",");
		for (var a = 0 ; a < atts.length ; a++) {
			var nameVal = atts[a].split("=");
			try {
				this.attributes[nameVal[0]] = nameVal[1];
			} catch (err) {
				throw new Error("Attribute syntax invalid parsing step " + step);
			}
		}
	}
	
	// Syntactic Sugar,  body.container#index  converts to <body id="index" class="container">
	
	if (stepPart.indexOf('#') > -1) {
		if (this.attributes === null) {
			this.attributes = {};
		}
		this.attributes.id = stepPart.substring(stepPart.indexOf('#') + 1);
		stepPart = stepPart.substring(0, stepPart.indexOf('#'));
	}
	
	if (dotIsClass && stepPart.indexOf('.') > -1) {
		if (this.attributes === null) {
			this.attributes = {};
		}
		this.attributes.class = stepPart.substring(stepPart.indexOf('.') + 1);
		stepPart = stepPart.substring(0, stepPart.indexOf('.'));
	}

	this.element = stepPart;

};

XGenPathStep.prototype.getAttributes = function() {
	return this.attributes;
};

XGenPathStep.prototype.getElement = function() {
	return this.element;
};

XGenPathStep.prototype.getArrayLength = function() {
	return this.arrayLength;
};

//ifdef NODEJS
if (typeof module !== 'undefined' && module.exports) {
	exports.XGenPath = XGenPath;
}
//endif
