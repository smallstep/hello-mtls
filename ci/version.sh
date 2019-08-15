#!/bin/env bash

git config --global user.email "alan@smallstep.com"
git config --global user.name "Alan Thomas"
git config --global push.default matching
git config credential.helper "store --file=.git/credentials"
echo "https://${GITHUB_API_KEY}:@github.com" > .git/credentials

yarn version --patch
git push origin HEAD:$TRAVIS_BRANCH
git push --tags
