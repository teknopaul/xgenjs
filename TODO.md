
create(context, "xGenPath")  does not accept a single Element as a context, only a list, should be a non-breaking change, requires unit tests.

Port preproccessing to 
* https://github.com/dcodeIO/Preprocessor.js

Remove all other code not needed with the Preprocessor
each() method should have args  each(i, elem)  to be compatible with jQuery

Prepared Statement style paths where create("foo/bar[?]", 4) can be used to safely inject numbers

