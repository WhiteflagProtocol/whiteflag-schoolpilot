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
You can now visit the application on localhost:3000

### With service worker

Make sure you have installed `serve` (`npm install serve`).
Run `npm run build`. This creates a build directory with a production build of the app.
Serve the build dirctory by executing `serve -s build`.
When `serve` is only installed as devDependencie => run `npx serve -s build`
You can now visit the application on localhost:3000

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
