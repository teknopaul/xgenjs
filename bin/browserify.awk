BEGIN {
	output=1;
}
/\/\/ifdef NODEJS/ {
	output=0;
}

/\/\/endif/ {
	output=1
	next;
}
/.*/ {
	if (output == 1) {
		print $0;
	}
}

