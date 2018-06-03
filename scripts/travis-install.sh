#!/bin/bash
echo 'travis_pull_request'$TRAVIS_PULL_REQUEST
if [ "${TRAVIS_PULL_REQUEST}" = "true" ]; then
    echo 'installing '$TRAVIS_PULL_REQUEST_BRANCH
    npm install -g create-react-matt@https://github.com/mcrowder65/create-react-matt#$TRAVIS_PULL_REQUEST_BRANCH
else
    echo 'installing master'
    npm install -g create-react-matt@https://github.com/mcrowder65/create-react-matt#master
fi