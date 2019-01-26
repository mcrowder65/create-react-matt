# Create react matt
[![NPM version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Total Status][total-image]][total-url]
[![PRs Welcome][pr-image]][pr-url]
[![Coverage Status][coverage-image]][coverage-url]

[npm-image]: https://badge.fury.io/js/create-react-matt.svg
[npm-url]: https://npmjs.org/package/create-react-matt

[travis-image]: https://travis-ci.org/mcrowder65/create-react-matt.svg?branch=master
[travis-url]: https://travis-ci.org/mcrowder65/create-react-matt

[total-image]: 	https://img.shields.io/npm/dt/create-react-matt.svg
[total-url]: 	https://img.shields.io/npm/dt/create-react-matt

[pr-image]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg
[pr-url]: http://makeapullrequest.com

[coverage-image]: https://coveralls.io/repos/github/mcrowder65/create-react-matt/badge.svg
[coverage-url]: https://coveralls.io/github/mcrowder65/create-react-matt

<h1>A non-extensible, opinionated React CLI</h1>

To use, `npm install -g create-react-matt && create-react-matt project-name`

This is a little CLI that I wrote to help me get up and running on react projects as quickly as possible with my preferred tools.

The idea is that when my coding style changes, I can just add extra files in there.

It was also fun to configure everything myself to know how something like create-react-app works under the hood.

Options:

```
-h, --help Displays the help menu
-y, --yarn Does installation with yarn instead of npm (assumes you have yarn installed globally)
-f, --force Runs rm -rf <your-project-name> before running the cli, use this with caution
-s, --skip Doesn't run npm install when initializing the project in case you just want to do so
-g, --git Does git init and creates a .gitignore
-t, --travis creates a .travis.yml file
```