
var TITLE = "Generation X";

var XGen = require('../lib/xgen-dom.js').XGen;
var assert = require('assert');
var XMLSerializer = require('xmldom').XMLSerializer;

var xGen = new XGen();
xGen.outputMethod = "html";
xGen.newDocument("/html{lang=en}/head/title").setTextContent(TITLE);
xGen.select("//head").create("link{rel=stylesheet}")
	.setAttribute("type", "text/css")
	.setAttribute("href", "http://maxcdn.bootstrapcdn.com/bootswatch/3.1.1/slate/bootstrap.min.css");

// Container
var container = xGen.select("//html").create("body/div.container");

// Header
container.create("div.row/div.col-md-12/h1.well").setTextContent(TITLE);

// Menu
container.create("div.row/div.col-md-2/ul.well/li[4]").setTextContent("Menu");

// jumbotron
xGen.select("//div[@class='row'][2]").create("div.col-md-10 jumbotron/h1").setTextContent("Programatic XML Generation");

// small footer
container.create("div.row/div.text-center/footer/p.small").setTextContent("Copyleft teknopaul");

console.log(new XMLSerializer().serializeToString(xGen.document));

