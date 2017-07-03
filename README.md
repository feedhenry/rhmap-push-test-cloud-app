# Cloud App for Stress Testing UPS integrated in RHMAP

This is a cloud app written in nodeJS that is to be deployed in a push project in RHMAP. The app will serve as the backend of the RHMAP-push-test-suite that performs integration tests against the UPS in order to stress the server and detect performance issues.

## Usage
#### Local
Install all dependencies and start it by running:
```bash
$ npm install && npm start
```
You should be able to see if it's running by opening http://localhost:8001.

#### RHMAP
Create a node _Cloud App_ inside your project and push this code to its git repository (git link in _Details_ section), then simply deploy the app (In _Deploy_ section). Remember to select a node version greater than or equal to 4.4.

Use this alongside with [rhmap-push-test-driver](https://github.com/feedhenry/rhmap-push-test-driver).

## APP authentication
In order to authenticate a mobile app that is to send a notification, its pushApplicationID and masterSecret must be stored in a dictionary-like JSON file named `app-auth.json`.
The format is like this:
```JSON
// app-auth.json
{
    "<appId>": {
        pushApplicationID: "<pushApplicationID",
        masterSecret: "<masterSecret>"
    }
}
```
Note: this is only necessary when using the push/ups routes.