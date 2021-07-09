#!/bin/bash

./node_modules/.bin/webpack --config webpack.config.lib.prod.js -p --env=production
cp ./.npmignore dist
cp ./LICENSE dist
cp ./package.json dist
cp ./README.md dist
rm -rf dist/demo
mv dist/src/* dist/
rm -rf dist/src
