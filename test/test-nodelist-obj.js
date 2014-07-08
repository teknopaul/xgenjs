
var assert = require('assert');

var XGenNodeList = require('../lib/xgen-nodelist.js').XGenNodeList;

var fakeNode1 = {
	nodeName : "fake1",
	appendChild : function() {
		console.log("appendChild called");
	}
};


var xGenNodeList = new XGenNodeList(null);

assert.equal(0, xGenNodeList.length);

xGenNodeList.add(fakeNode1);

assert.equal(1, xGenNodeList.length);
assert.equal(fakeNode1.nodeName, xGenNodeList[0].nodeName);
assert.equal(fakeNode1.nodeName, xGenNodeList.item(0).nodeName);


var fakeNode2 = {
	nodeName : "fake2",
	appendChild : function() {
		console.log("appendChild called");
	}
};

xGenNodeList.add(fakeNode2);

assert.equal(2, xGenNodeList.length);
assert.equal(fakeNode2.nodeName, xGenNodeList[1].nodeName);
assert.equal(fakeNode2.nodeName, xGenNodeList.item(1).nodeName);

// addElements with an Array
xGenNodeList = new XGenNodeList(null);
xGenNodeList.addElements([fakeNode1, fakeNode2]);
assert.equal(2, xGenNodeList.length);
assert.equal(fakeNode2.nodeName, xGenNodeList[1].nodeName);
assert.equal(fakeNode2.nodeName, xGenNodeList.item(1).nodeName);


// addElements with a Node
xGenNodeList = new XGenNodeList(null);
xGenNodeList.addElements(fakeNode1);
assert.equal(1, xGenNodeList.length);
assert.equal(fakeNode1.nodeName, xGenNodeList[0].nodeName);
assert.equal(fakeNode1.nodeName, xGenNodeList.item(0).nodeName);
xGenNodeList.addElements(fakeNode2);
assert.equal(2, xGenNodeList.length);
assert.equal(fakeNode2.nodeName, xGenNodeList[1].nodeName);
assert.equal(fakeNode2.nodeName, xGenNodeList.item(1).nodeName);


// addElements with a NodeList
var xGenNodeList2 = new XGenNodeList(null);
xGenNodeList2.addElements(xGenNodeList);
assert.equal(2, xGenNodeList2.length);
assert.equal(fakeNode1.nodeName, xGenNodeList2[0].nodeName);
assert.equal(fakeNode1.nodeName, xGenNodeList2.item(0).nodeName);
assert.equal(fakeNode2.nodeName, xGenNodeList2[1].nodeName);
assert.equal(fakeNode2.nodeName, xGenNodeList2.item(1).nodeName);