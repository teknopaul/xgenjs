
var XGenPath = require('../lib/xgen-path.js').XGenPath;
var assert = require('assert');


var path = new XGenPath("body/div");
assert.equal("body", path.getStep().element);
assert.equal("div", path.next().getStep().element);

path = new XGenPath("body/div[2]");
assert.equal("body", path.getStep().element);
assert.equal(2, path.next().getStep().getArrayLength());

path = new XGenPath("body/div.container");
assert.equal("body", path.getStep().element);
assert.equal("container", path.next().getStep().attributes.class);

path = new XGenPath("body/div#home");
assert.equal("body", path.getStep().element);
assert.equal("home", path.next().getStep().attributes.id);

path = new XGenPath("body/div.container#home");
assert.equal("body", path.getStep().element);
assert.equal("container", path.next().getStep().attributes.class);
assert.equal("home", path.next().getStep().attributes.id);


path = new XGenPath("body/div{foo=bar,quxx=wibble}");
assert.equal("body", path.getStep().element);
assert.equal("bar", path.next().getStep().attributes.foo);
assert.equal("wibble", path.next().getStep().attributes.quxx);

path = new XGenPath("div{foo=bar,quxx=wibble}[5]");
assert.equal("bar", path.getStep().attributes.foo);
assert.equal("wibble", path.getStep().attributes.quxx);
assert.equal(5, path.getStep().getArrayLength());
