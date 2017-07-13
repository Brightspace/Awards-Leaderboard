# Awards Leaderboard

## Overview

This repo represents a demo/sample solution to show what can be done with the Brightspace Awards APIs.

This solution makes use of the classlist awards route, `/d2l/api/bas/1.0/orgunits/{orgUnitId}/classlist/`, to enable the gathering of the users, their awards and their rankings.

This solution uses Polymer and Brightspace UI components to create the UI.

Please note, this repo is not intended to be used in production. 

### Technology Used

* node
* Brightspace UI Components 
* Polymer Components
* LTI
* OAuth2.0
* Brightspace APIs

## Setup Instructions

Options for getting started:

* [Download the latest release](../../releases).
* Clone the repo: `git clone https://github.com/Brightspace/Awards-Leaderboard.git`.

### Installation

Run the NPM installation command in the root folder of the project using the command line.

```javascript 
npm install
```

Run the Bower installation command in the root folder of the project using the command line.

```javascript 
bower install
```

Build the UI by running the following command in the root folder of the project using the command line. This will output an index.html file to the dist folder in the project root.

```javascript 
npm run build
```

At this point you are able to run the node server by running the node command on the server.js file.

```javascript 
node server.js
```

Note: if you are working with a local Brightspace instance you can run the following command that will use a self signed certificate so that you are able to use OAuth 2.0 successfully.

```javascript 
node server-local.js
```

### Configurations

There are several configurations in this project that can be set at the environment level (using environment variables), that the app will use to conduct it's various authentication checks and execute successfully against the desired Brightspace instance. These configurations can also be overridden in the configurations.js file found under the server folder in this project.
 
* AUTH_SCOPE - the scope required for the application in order to call the required Brightspace APIs, for the awards APIs the currently required scope is `core:*:*`
* AUTH_ENDPOINT - the endpoint used for retrieving an authentication code that is exchanged in the callback for an access token - [Setting Up OAuth 2.0 Authentication](http://docs.valence.desire2learn.com/basic/oauth2.html?highlight=oauth#setting-up-oauth-2-0-authentication)
* CLIENT_ID - the client id for the OAuth client created in Brightspace
* CLIENT_SECRET - the client secret for the OAuth client created in Brightspace
* COOKIE_NAME - the name of the cookie where the UserId, OrgUnitId and the access token are stored for the user's session
* INSTANCE_URL - the URL for the Brightspace instance where the calls to the APIs are going to be made
* LTI_SECRET - the secret used when setting up the Learning Tool Provider in Brightspace, this is used to generate the signature in order to verify the request came from an authorized instance of Brightspace
* STATE - the state is a pre-defined string (recommended to be a randomly generated guid) that is sent across in the OAuth authentication request and is sent back in the callback from Brightspace so that you can verify that the callback is coming from Brightspace
* TOKEN_ENDPOINT - the endpoint used for exchanging the authentication code for an access token that is then used in API requests - [Setting Up OAuth 2.0 Authentication](http://docs.valence.desire2learn.com/basic/oauth2.html?highlight=oauth#setting-up-oauth-2-0-authentication)
* PORT - the port which the server will listen for requests on

### SSL
In order for the OAuth 2.0 implementation to be able to authenticate and to be setup in Brightspace it requires an https endpoint. Therefore when this application is used it needs to be setup using a certificate and hosted in an environment where the https protocol is enabled.

## External Links

Here is a listing of useful links about the Brightspace API, Awards API and the LTI technology used in this project.

### Brightspace Info

* [Remote Plugins Basics](http://docs.valence.desire2learn.com/ui-ext/rplugins.html)
* [OAuth2.0 Basics](http://docs.valence.desire2learn.com/basic/oauth2.html)
* [Extend LMS Part 1: LTI Primer](https://community.brightspace.com/s/article/ka1610000000pcJAAQ/So-you-want-to-extend-your-LMS-Part-1-LTI-Primer)
* [Extend LMS Part 2: Remote Plugins](https://community.brightspace.com/s/article/ka1610000000pR6AAI/So-you-want-to-extend-your-LMS-Part-2-Remote-Plugins)
* [LTI Link Added to Navbar](https://community.brightspace.com/s/article/ka1610000000pY7AAI/How-to-Add-an-LTI-Link-to-a-NavBar)
* [External Learning Tool Provider Setup](https://community.brightspace.com/s/article/ka1610000000pVXAAY/The-Why-and-How-of-setting-up-an-External-Learning-Tool-Provider)

### Brightspace API

* [Brightspace API Documentation (General)](http://docs.valence.desire2learn.com/reference.html)
* [Awards API Documentation](http://docs.valence.desire2learn.com/res/awards.html)
* [LTI API Documentation](http://docs.valence.desire2learn.com/res/lti.html)

### Brightspace UI Components 

* [Brightspace UI Developer Guidlines](http://ui.developers.brightspace.com)
* [d2l-typography](https://github.com/BrightspaceUI/typography)
* [d2l-button](https://github.com/BrightspaceUI/button)
* [d2l-loading-spinner](https://github.com/BrightspaceUI/loading-spinner)
* [d2l-icons](https://github.com/BrightspaceUI/icons)

## Versioning

Awards-Leaderboard is maintained under [the Semantic Versioning guidelines](http://semver.org/).

## Contributing

Please read through our [contributing guidelines](CONTRIBUTING.md). Included are directions for opening issues, coding standards, and notes on development.