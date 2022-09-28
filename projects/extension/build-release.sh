#!/bin/bash
rm release.zip
rm -rf build/
npm run build
zip -vr release.zip build/ -x "*.DS_Store"