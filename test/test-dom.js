
var TITLE = "Generation X";

var XGen = require('../lib/xgen-dom.js').XGen;
var assert = require('assert');
var DOMImplementation = require('xmldom').DOMImplementation;
var XMLSerializer = require('xmldom').XMLSerializer;

var xGen = new XGen(new DOMImplementation());
xGen.newDocument("/html{lang=en}/head/title").setTextContent(TITLE);

xGen.select("//head").create("link{rel=stylesheet}")
	.setAttribute("type", "text/css")
	.setAttribute("href", "http://maxcdn.bootstrapcdn.com/bootswatch/3.1.1/slate/bootstrap.min.css");

console.log(new XMLSerializer().serializeToString(xGen.document));
