#!/bin/bash -e
#
#  Compiles the JavaScript with node to quickly detect syntax errors
#
cd `dirname $0`


# test compilaiton under nodejs
echo ../lib/xgen-dom.js
node ../lib/xgen-dom.js 

echo ../lib/xgen-nodelist.js
node ../lib/xgen-nodelist.js 

echo ../lib/xgen-path.js
node ../lib/xgen-path.js 

echo ../lib/xml-serializer.js
node ../lib/xml-serializer.js 

for jsfile in `ls -1 ../test/*.js`
do
	echo $jsfile
	node $jsfile
done

 
