/*
 * LGPL: http://www.gnu.org/licenses/lgpl.html
 * Code extracted from https://github.com/jindw/xmldom
 * Pretty Printing added by @teknopaul
 */


/**
 * XMLSerializer polyfill, also works for nodejs with 
 * var serializer = require("xml-serializer").XMLSerializer;
 * // To turn on pretty printing use XMLSerializer2 and set the indent
 * var serializer = new XMLSerializer2();
 * serializer.indent = 2;
 */
//ifdef NODEJS
if ( ! window) var window = {};
//endif

/**
 * XMLSerializer with pretty printing added, (hence the 2)
 * In a browser if you call new XMLSerializer() you get the in built one without indentation support.
 * 
 * @constructor
 * @public
 */
XMLSerializer2 = function () {
	/**
	 * Indentation {number} from 0 to 8
	 * @public
	 */
	this.indent = 0;
	// @private current state of the padding.
	this.padding = "";
};

XMLSerializer2.HTML_NS = 'http://www.w3.org/1999/xhtml' ;
// Node Types
XMLSerializer2.ELEMENT_NODE           = 1;
XMLSerializer2.ATTRIBUTE_NODE         = 2;
XMLSerializer2.TEXT_NODE              = 3;
XMLSerializer2.CDATA_SECTION_NODE     = 4;
XMLSerializer2.ENTITY_REFERENCE_NODE  = 5;
XMLSerializer2.ENTITY_NODE            = 6;
XMLSerializer2.PROCESSING_INSTRUCTION_NODE = 7;
XMLSerializer2.COMMENT_NODE           = 8;
XMLSerializer2.DOCUMENT_NODE          = 9;
XMLSerializer2.DOCUMENT_TYPE_NODE     = 10;
XMLSerializer2.DOCUMENT_FRAGMENT_NODE = 11;
XMLSerializer2.NOTATION_NODE          = 12;

/**
 * 
 * @public
 */
XMLSerializer2.prototype.serializeToString = function(node) {
	var buf = [];
	this._serializeToString(node, buf);
	return buf.join('');
};

XMLSerializer2.prototype._xmlEncoder = function(c) {
	return c == '<' && '&lt;'   ||
	       c == '>' && '&gt;'   ||
	       c == '&' && '&amp;'  ||
	       c == '"' && '&quot;' ||
	       '&#' + c.charCodeAt() + ';'
};

XMLSerializer2.prototype._serializeToString = function(node, buf) {
	switch(node.nodeType){
		case XMLSerializer2.ELEMENT_NODE:
			var attrs = node.attributes;
			var len = attrs.length;
			var child = node.firstChild;
			var nodeName = node.tagName;
			var isHTML = XMLSerializer2.HTML_NS === node.namespaceURI;
			if (this.indent) buf.push(this.padding);
			buf.push('<',nodeName);
			for (var i = 0 ; i < len ; i++) {
				this._serializeToString(attrs.item(i), buf, isHTML);
			}
			if (child || isHTML && !/^(?:meta|link|img|br|hr|input)$/i.test(nodeName)) {
				buf.push('>');
				if (this.indent && node.firstChild.nodeType !== XMLSerializer2.TEXT_NODE) {
					if (this.indent) {
						buf.push("\n");
					}
				}
				//if is cdata child node
				if (isHTML && /^script$/i.test(nodeName)) {
					if(child){
						buf.push(child.data);
					}
				} else {
					while(child){
						if (this.indent) this.padding += "        ".substring(0, this.indent);
						this._serializeToString(child, buf);
						if (this.indent) this.padding = this.padding.substring(this.indent);
						child = child.nextSibling;
					}
				}
				if (this.indent && node.firstChild.nodeType !== XMLSerializer2.TEXT_NODE) {
					buf.push(this.padding);
				}
				buf.push('</',nodeName,'>');
				if (this.indent) {
					buf.push("\n");
				}
			} else {
				buf.push('/>');
				if (this.indent) {
					buf.push(this.padding);
					buf.push("\n");
				}
			}
			return;
		case XMLSerializer2.DOCUMENT_NODE:
		case XMLSerializer2.DOCUMENT_FRAGMENT_NODE:
			var child = node.firstChild;
			while (child) {
				this._serializeToString(child, buf);
				child = child.nextSibling;
			}
			return;
		case XMLSerializer2.ATTRIBUTE_NODE:
			return buf.push(' ', node.name, '="', node.value.replace(/[<&"]/g, this._xmlEncoder), '"');
		case XMLSerializer2.TEXT_NODE:
			return buf.push(node.data.replace(/[<&]/g, this._xmlEncoder));
		case XMLSerializer2.CDATA_SECTION_NODE:
			return buf.push( '<![CDATA[', node.data, ']]>');
		case XMLSerializer2.COMMENT_NODE:
			return buf.push( "<!--", node.data, "-->");
		case XMLSerializer2.DOCUMENT_TYPE_NODE:
			var pubid = node.publicId;
			var sysid = node.systemId;
			buf.push('<!DOCTYPE ', node.name);
			if (pubid) {
				buf.push(' PUBLIC "', pubid);
				if (sysid && sysid != '.') {
					buf.push( '" "',sysid);
				}
				buf.push('">');
			} else if (sysid && sysid!='.') {
				buf.push(' SYSTEM "', sysid, '">');
			} else {
				var sub = node.internalSubset;
				if (sub) {
					buf.push(" [", sub, "]");
				}
				buf.push(">");
			}
			return;
		case XMLSerializer2.PROCESSING_INSTRUCTION_NODE:
			return buf.push( "<?", node.target, " ", node.data, "?>");
		case XMLSerializer2.ENTITY_REFERENCE_NODE:
			return buf.push( '&', node.nodeName, ';');
		//case XMLSerializer2.ENTITY_NODE:
		//case XMLSerializer2.NOTATION_NODE:
		default:
			buf.push('??', node.nodeName);
	}
};


//ifdef NODEJS
if (typeof module !== 'undefined' && module.exports) {
	module.exports.XMLSerializer = XMLSerializer2;
}
//endif

// polyfill 
if ( ! window.XMLSerializer) {
	window.XMLSerializer = XMLSerializer2;
}