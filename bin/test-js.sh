#!/bin/bash

cd `dirname $0`


for testcase in `ls -1 ../test/test*.js`
do
	echo node ${testcase}
	node ${testcase}
done
