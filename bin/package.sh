#!/bin/bash
#
# Package for publishing
#
cd $(dirname $0)
cd ..

VERSION=`grep version package.json | head -1 | cut '--delimiter=:' -f2 | tr -d ' ",'`

tar cvf xgenjs-$VERSION.tar lib node_modules test jquery.xgen.js jquery.xgen.min-1.0.5.js package.json README.md xgen.jquery.json

test -f xgenjs-$VERSION.tar.gz && rm xgenjs-$VERSION.tar.gz
gzip xgenjs-$VERSION.tar
