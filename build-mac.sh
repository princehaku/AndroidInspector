#!/bin/sh
appname=androidInspector-v$(date +%Y%m%d).app
rm -rf $appname
cp -r nw-mac/node-webkit.app ./$appname
cp -r src $appname/Contents/Resources/app.nw
cp -r build-res/nw.icns $appname/Contents/Resources/nw.icns
