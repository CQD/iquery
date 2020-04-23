.PHONY: build test qunit clean

JS_BINS=node_modules/uglify-js/bin/uglifyjs

build: build/iquery.min.js
	@ echo "Source file size             : " $$(cat src/iquery.js | wc -c)
	@ echo "Minified file size           : " $$(cat build/iquery.min.js | wc -c)
	@ echo "Minified + gzipped file size : " $$(cat build/iquery.min.js | gzip | wc -c)

build/iquery.min.js: src/iquery.js node_modules/uglify-js/bin/uglifyjs
	cat src/iquery.js | node_modules/uglify-js/bin/uglifyjs -c -m > $(@)
	@ echo ====================================================

$(JS_BINS):
	npm i

test: qunit
	command -v open > /dev/null && open tests/index.html || command -v xdg-open && xdg-open tests/index.html || echo 'Please open tests/index.html for test result'

clean:
	rm tests/qunit.js tests/qunit.css
	rm build/iquery.min.js

###########################

qunit: tests/qunit.js tests/qunit.css

tests/qunit.js:
	curl -s https://code.jquery.com/qunit/qunit-2.9.2.js > tests/qunit.js

tests/qunit.css:
	curl -s https://code.jquery.com/qunit/qunit-2.9.2.css > tests/qunit.css
