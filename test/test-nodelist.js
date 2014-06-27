
var assert = require('assert');

var XGen = require('../lib/xgen-dom.js').XGen;
var DOMImplementation = require('xmldom').DOMImplementation;
var XMLSerializer = require('xmldom').XMLSerializer;

var TITLE = "Generation X";

var xGen = new XGen(new DOMImplementation());
xGen.outputMethod = "html";
xGen.newDocument("/html{lang=en}/head/title").setTextContent(TITLE);

assert.equal("html", xGen.select("//html").item(0).nodeName);
assert.equal(1, xGen.select("//html").length);

xGen.select("//html").create("body#home")
	.setAttribute("type", "text/css")

xGen.select("//body").create("div.setatts[3]")
	.setAttributes([
		{ att1 : "123"},
		{ att2 : "abc"},
		{ att3 : "xyz"}
	])
	.appendChild(xGen.document.createComment(" comment text "))

xGen.select("//body").create("div/ul/li[3]")
	.create("p/a")
	.setAttribute("href", "#")
	.setAttributes([
		{ onclick : "menu()"},
		{ onclick : "home()"},
		{ onclick : "exit()"}
	])
	.each(function(node) {
		node.setAttribute("title", node.getAttribute("onclick").substring(0,4).toUpperCase())
		return node.parentNode;
	})
	.setAttribute("class", "light")
	.create("<span class=\"excl\">!!!</span>")
	


// check readonly ness
var nl  = xGen.select("//html");
nl.lenth = 2;
assert.equal(1, nl.length);

// check array syntax
var elem = xGen.select("//html")[0];
assert.equal(elem.nodeName, nl.item(0).nodeName);
// check array length gets updated
assert.equal(4, xGen.select("//body/div").length);

console.log(new XMLSerializer().serializeToString(xGen.document));
