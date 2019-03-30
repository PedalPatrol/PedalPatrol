<h1 align="center">
  <a href="https://pedalpatrol.github.io/PedalPatrol">
    Pedal Patrol
  </a>
</h1>

<p align="center">
  <strong>Crowdsourcing the retrieval of stolen bikes.</strong><br>
</p>


<p align="center">
  <a href="https://travis-ci.org/PedalPatrol/PedalPatrol"><img src="https://travis-ci.org/PedalPatrol/PedalPatrol.svg?branch=master"></a>
  <a href='https://coveralls.io/github/PedalPatrol/PedalPatrol?branch=master'><img src='https://coveralls.io/repos/github/PedalPatrol/PedalPatrol/badge.svg?branch=master' alt='Coverage Status' /></a>
</p>

Development of the PedalPatrol iOS and Android application.

## Installation
1. Clone the github repository.
```
git clone https://github.com/PedalPatrol/PedalPatrol.git
```
2. Move into the Pedal Patrol directory with the package.json file.
```
cd PedalPatrol/PedalPatrol
```
3. Install the dependencies.
```
npm install
```
4. Run the setup script to setup any dependencies properly.
```
npm run setup
```

## Setup
1. Add your Google Maps API key to PedalPatrol/android/app/src/main/AndroidManifest.xml to the meta-data for key "com.google.android.geo.API_KEY"
```
...
    <meta-data
        android:name="com.google.android.geo.API_KEY"
        android:value="--YOUR-API-KEY--"/>
</application>
```
2. Obtain the config details for your Firebase project from https://console.firebase.google.com and include them in the databaseConfig object in PedalPatrol/src/config/config.json
3. In the iOS app on Firebase, download the GoogleServices-Info.plist and store it in PedalPatrol/ios. Add the file to the ios project if it is not already included by right clicking on the project name and clicking "Add Files to PedalPatrol".
4. To setup for iOS run the following command:
```
npm run setup:ios
```

## Running
### Android
#### Emulator
1. Start an emulator either from the command line or from Android Studio.
MacOS
```
~/Library/Android/sdk/emulator/emulator -avd EMULATOR_NAME
```
Windows
```
C:/Documents/user/Library/Android/sdk/emulator/emulator -avd EMULATOR_NAME
```
2. Building and Running - For more information on debugging see: https://facebook.github.io/react-native/docs/debugging
2.1 Debugging and output on command line - The app can be debugged from the command line by running the following command:
```
react-native log-android
```
2.2 Debugging and output in browser - The app can be debugged from Google Chrome or another browser by running the following command:
```
react-native run-android
```
#### Physical Device
1. Follow the steps [here](https://facebook.github.io/react-native/docs/running-on-device) to setup running on a physical device.
2. Run any of the above commands to run on android.

### iOS
#### Emulator
1. Building and Running - Run the following command to debug on an emulator:
```
react-native run-ios
```
Note 1: Only MacOS computers with Xcodebuild tools and Xcode can build and run the iOS app.
Note 2: react-native log-ios does not currently work on the version of react-native that is used in PedalPatrol.
Note 3: The default ios emulator device is an iPhone X. The emulator used can be changed using the following command (example using iPhone 8):
```
react-native run-ios --simulator="iPhone 8"
```
#### Physical Device
1. Follow the steps [here](https://facebook.github.io/react-native/docs/running-on-device) to setup running on a physical device.
2. Run the following command:
```
react-native run-ios --device
```
or
```
react-native run-ios --device "NAME_OF_CONNECTED_DEVICE"
```

## Tests
Tests are facilitated by the Jest tool and can be found in PedalPatrol/test. The folder structure of the tests is the same as in PedalPatorl/src. Tests are automatically run with the --silent flag on.
To run the tests run the following command from PedalPatrol/PedalPatrol:
```
npm test
```
