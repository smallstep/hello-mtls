#!/bin/bash

git config --global user.email "alan@smallstep.com"
git config --global user.name "Alan Thomas"
git config --global push.default matching
git config credential.helper "store --file=~/.git-credentials"
echo "https://${GITHUB_API_KEY}:@github.com" > ~/.git-credentials

yarn version --patch --message "v%s [ci skip]"
git push origin HEAD:$TRAVIS_BRANCH
git push --tags

echo "//registry.npmjs.org/:_authToken=${NPM_AUTH_TOKEN}" > ~/.npmrc

yarn dist
cd dist
yarn publish --access public
