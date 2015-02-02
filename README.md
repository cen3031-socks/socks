# SOCKS

## Overview

This is a web application to manage the records for cat shelters -- specifically, Save Our
Cats and Kittens (SOCKS). It will track records for cats in the shelter, like needed
treatments, their locations, potential adopters, etc. In addition, it will manage the
shelter's contacts, donors, shelter intake, and track volunteers. 

## Team

* Aaron Silcott
* Alexander Russ
* Ben Grider
* Eric Pogash
* Nick Munarriz
* Reid Gill

## User Stories
User stories can be accessed by [clicking here](https://trello.com/b/dIzqURUh/user-stories).

## Prerequisites
Make sure you have installed all of the following prerequisites on your development machine:
* Node.js - [Download & Install Node.js](http://www.nodejs.org/download/) and the npm package manager. If you encounter any problems, you can also use this [GitHub Gist](https://gist.github.com/isaacs/579814) to install Node.js.
* MongoDB - [Download & Install MongoDB](http://www.mongodb.org/downloads), and make sure it's running on the default port (27017).
* Bower - You're going to use the [Bower Package Manager](http://bower.io/) to manage your front-end packages. Make sure you've installed Node.js and npm first, then install bower globally using npm:

```bash
$ npm install -g bower
```

* Grunt - You're going to use the [Grunt Task Runner](http://gruntjs.com/) to automate your development process. Make sure you've installed Node.js and npm first, then install grunt globally using npm:

```bash
$ npm install -g grunt-cli
```

## Downloading
Clone this GitHub repository

```bash
$ git clone https://github.com/cen3031-socks/socks.git socks
```

This will clone the latest version of the SOCKs repository to a **socks** folder. Once
you've downloaded it, you install it with npm: 

```bash
$ npm install
```

This command does a few things:
* First it will install the dependencies needed for the application to run.
* If you're running in a development environment, it will then also install development dependencies needed for testing and running the application.
* Finally, when the install process is over, npm will initiate a bower install command to install all the front-end modules needed for the application.

After the install process is over, you'll be able to run it using Grunt. Just run grunt default task:

```bash
$ grunt
```

The application should run on port 3000, so in your browser just go to [http://localhost:3000](http://localhost:3000)
