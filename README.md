# Whiteflag School Pilot

## Introduction

[Whiteflag](https://whiteflagprotocol.org/) is a fully neutral and secure
communciations protocol based on blockchain technology. It enables near
real-time communication in conflict and disaster areas to exchange early
warning and status information to create shared situational awareness.
The [Whiteflag Protocol specification](https://standard.whiteflagprotocol.org/)
is an open standard.

This Whiteflag pilot is to build a so called [Minimum Viable Product](https://en.wikipedia.org/wiki/minimum_viable_product)
(MVP) to communicate the location of schools.

## Planning

The project is currently in planning. More details will follow soon.

## Run App

### Without service worker

Run `npm install`
Run `npm start`
You can now visit the application in your browser: localhost:3000

### With service worker

Make sure you have installed `serve` (`npm install serve`).
Run `npm run build`. This creates a build directory with a production build of the app.
Serve the build dirctory by executing `serve -s build`.
When `serve` is only installed as devDependencie => run `npx serve -s build`
You can now visit the application on localhost:3000

### Known Issue & fix: Black screen (install node version 20)

If you encounter a black screen after starting the app,
check your Node version, if it is not version 20 try
changing it to version 20 with Node Version Manager.

Fix:

1. Install Node Version Manager 2. Company computer? 3. On your computer open 'Bedrijfsportaal' or 'Company Portal' and open 'Pre-Approved Catalogue'. 3. Request to install 'NVM for Windows'
2. Open windows CMD 5. Type `nvm install 20` 6. Check node version with `node -v`

## Run mock database

Make sure you have installed `json-server` (`npm install json-server`)
Run `json-server --watch db.json`
This will start the server on localhost:3000. Since the application is also running on port 3000, you can give an alternetive port by adding the port flag (`--port <port-number>` (fe 5001)).

### server.js

Re-route db.json with `node server.js` (install express (`npm install express`)).

### Extending the app

All available endpoints from Fennel labs can be found on there [GitHub account](https://github.com/fennelLabs/fennel-service-api/blob/master/requests/api.http) and there documentation can be found on the [wiki](https://github.com/fennelLabs/fennel-service-api/wiki) of this page.

### Working with the app

Once the app is up and running you can create an account in the interface.

With your account you can create an API-group via the [Dashboard of Fennel labs](https://api.fennellabs.com/dashboard/login/). Via this dashboard it is also possible to accept people to this group and add tokens to theire account.

## Running the locally served app on an Android device

### Android device setup

- Enable developer mode by navigating to "about device" and tapping the build number repeatedly
- Under developer settings, enable USB debugging
- Connect phone to computer via USB and ensure the phone is _not_ connected as a media transfer device ("USB tethering" does work)
- Note: if it does not ask you for USB connection options, look for a notification option... something like 'USB settings'

### Android Debugger setup on computer

#### MAC OS

- Download the [Android SDK platform tools](https://developer.android.com/tools/releases/platform-tools) and add to your path: `export PATH=$PATH:/path/to/extracted/folder/`
- Run `adb start-server`
- Run `adb devices` - your Android device should be listed here

#### WINDOWS OS

- Download the [Android SDK platform tools](https://developer.android.com/tools/releases/platform-tools)
- Extract the content to a folder on your computer
- Open your terminal (CMD) and navigate to the extracted folder
  - Steps:
    - Press Windows+R and type CMD
    - In CMD type `cd` and paste the location path of the "platform-tools" folder and hit enter
    - The command should look like something like this: `cd C:\Users\Me\OneDrive\Documents\platform-tools-latest-windows\platform-tools`
- In the CMD type and run: `adb start-server`
- Check if your phone is listed with `adb devices`
  - Note: if it is not listed, look for a notification option... something like 'USB settings' and use "USB tethering"

### Access local application from Android

- In your chrome browser, navigate to `chrome://inspect/#devices`
- Enable portforwarding and add `localhost:3000` to the list
- Start the whiteflag application `npm start`
- Navigate to `localhost:3000` on your Android device's chrome browser
- If it asks you to install Whiteflag, click yes and run the newly installed Whiteflag app
  - Note: if it does not ask you for an install, you can do it manually by click chrome options and "add to Home screen"

### Access debug logs

- Navigate to `chrome://inspect/#devices` on your computer
- Search for Whiteflag (localhost if app isn't installed) under your device and click on 'inspect'

### Debugging tips

- Sometimes the adb process freezes, just kill it and restart
- If your device isn't listed when you run `adb devices`, try reinserting the usb
