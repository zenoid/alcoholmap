LIBRARY_FILES = \
	node_modules/d3/src/start.js \
	node_modules/d3/src/arrays/max.js \
	node_modules/d3/src/arrays/min.js \
	node_modules/d3/src/dsv/csv.js \
	node_modules/d3/src/xhr/xml.js \
	node_modules/d3/src/scale/sqrt.js \
	node_modules/d3/src/selection/selection.js \
	node_modules/d3/src/end.js \

js/libs/d3.js: $(LIBRARY_FILES)
	node_modules/.bin/smash $(LIBRARY_FILES) > $@