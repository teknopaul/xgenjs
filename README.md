# xgenjs

A Javascript implementation of xGenPaths.

xgenjs enables using XPath like statements to _generate_ XML.

The following _xGenPath_ will create the expected XML output.

    div#container/table.table/tbody/tr/td[5]

xGenPaths were designed for generating XML documents but also serve generating HTML DOM elements.

## Generating XML server side

xgenjs uses standard [DOM APIs](https://developer.mozilla.org/en-US/docs/Web/API/DOMImplementation) of which there are a few implementations for nodejs.
The code is tested with [xmldom](https://github.com/jindw/xmldom), any DOM that conforms to DOM Level 2 should work.

Typical code is as follows (HTML schema used as an example)

````javascript
    var XGen = require('xgenjs').XGen;
    
    // Create a new XML document
    var xGen = new XGen();
    xGen.newDocument("/html{lang=en}/head/title").setTextContent(TITLE);
    
    // select() and create() calls used to generate XML.
    xGen
        .select("//html")
        .create("body/div#container/div#menu/ul/li[5]");
    
    xGen
        .select("//body")
        .create("div#footer/footer/span.small/a")
        .setTextContent("Built with xgenjs")
        .setAttribute("href", "https://github.com/teknopaul/xgenjs");
````

xGenPaths create elements at a given points in the DOM tree, server side the technology used to `select()` is xpath. 
N.B. XPaths and xGenPaths are not the same.

Syntax of xGenPaths can be found here [SYNTAX](https://github.com/teknopaul/generation-x/blob/master/SYNTAX.md)

## Generating XML client side

xgenjs can also be used to create XML on the client side. Either to generate HTML to insert into the current page or XML to send via AJAX.

The `select()` method in the browser typically uses CSS Selectors, ala jQuery. It can also use XPaths if a Javascript implementation of xpath is loaded.

## Generating HTML client side

XGen can also integrate to jQuery providing the `$.create(xGenPath)` method which when used like this returns a jQuery NodeList.

There are two integration options, one is a jQuery plugin that only adds `$.create()`. 

    <script type="text/javascript" src="jquery.xgen.js"></script>


The other option adds the `$.create()` method if jQuery is available but is not dependent on jQuery. 

    <script type="text/javascript" src="xgen-browser-1.0.x.js"></script>

It also creates the XGen object which can be used to generate HTML and XML.
This mechanism requires that you specify which type of output and which type of selector you require for each XGen object created.
