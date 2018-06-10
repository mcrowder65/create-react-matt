#!/bin/bash
if [ "${TRAVIS_PULL_REQUEST}" = "false" ]; then
    echo 'installing master'
    npm install -g create-react-matt
else
    echo 'installing '$TRAVIS_PULL_REQUEST_BRANCH
    npm install -g create-react-matt@https://github.com/mcrowder65/create-react-matt#$TRAVIS_PULL_REQUEST_BRANCH
fi