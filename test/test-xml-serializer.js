
var XGen = require('../lib/xgen-dom.js').XGen;
var XMLSerializer = require('../lib/xml-serializer.js').XMLSerializer;
var assert = require('assert');

var xGen = new XGen();
xGen.newDocument("/html{lang=en}/head/title").setTextContent("min");
xGen.select("//html").create("body/p").setTextContent("Minimum Viable HTML");

var serializer = new XMLSerializer();
serializer.indent = 0;
console.log(serializer.serializeToString(xGen.document));
serializer.indent = 2;
console.log(serializer.serializeToString(xGen.document));

xGen.select("//body").create("ul/li[5]/a{href=foo}");
console.log(serializer.serializeToString(xGen.document));
