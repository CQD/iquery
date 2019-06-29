.PHONY: build test

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

test:
	command -v open > /dev/null && open tests/index.html || command -v xdg-open && xdg-open tests/index.html || echo 'Please open tests/index.html for test result'

