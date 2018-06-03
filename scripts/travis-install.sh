#!/bin/bash
echo $TRAVIS_PULL_REQUEST_BRANCH
npm install -g create-react-matt@https://github.com/mcrowder65/create-react-matt#$TRAVIS_PULL_REQUEST_BRANCH