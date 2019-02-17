#!/bin/bash

# Hidden file. Only use if you need to run this command quickly.

# Resets the build

touch .tmp.txt

# build.gradle
echo "y" >> .tmp.txt
# AndroidManifest.xml
echo "n" >> .tmp.txt
# MainApplication.java
echo "n" >> .tmp.txt
# settings.gradle
echo "y" >> .tmp.txt
# Info.plist
echo "n" >> .tmp.txt
# project.pbxproj
echo "y" >> .tmp.txt

# Broken, TODO: Fix
# rm -rf node_modules/ && npm install && cat .tmp.txt | react-native upgrade && react-native link
rm -rf node_modules/ && npm install && react-native upgrade && react-native link

rm -f .tmp.txt