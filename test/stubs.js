/**
 * @constructor
 */
Element = function() {
	atts = {};
};
Element.prototype.getAttribute = function(name) {
	return atts[name];
};
Element.prototype.setAttribute = function(name, value) {
	atts[name] = value;
};
Element.prototype.getElementsByTagName = function() {
	return [];
};
/**
 * @constructor
 */
Document = function() {
	
};
Document.prototype.createElement = function() {
	return new Element();
};

/**
 * @constructor
 */
Window = function() {
};

$ = {
	fn : {}
};
jQuery = $;

window = new Window();
document = new Document();
window.document = document;
