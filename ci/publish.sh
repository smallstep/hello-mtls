#!/bin/bash

set -e

# configure git
git config --global user.email "alan@smallstep.com"
git config --global user.name "Alan Thomas"
git config --global push.default matching
git config credential.helper "store --file=.git/credentials"
echo "https://${GITHUB_API_KEY}:@github.com" > .git/credentials

# bump the version, commit, and push
yarn version --patch --message "v%s [ci skip]"
git push origin HEAD:$TRAVIS_BRANCH
git push --tags

# copy logo assets for upload
mkdir -p assets
cp src/graphics/dummy.png assets/dummy.png
find docs/*/logo.png -type f | xargs dirname | xargs -I {} basename {} | xargs -I {} cp docs/{}/logo.png assets/{}.png

# configure npm
echo "//registry.npmjs.org/:_authToken=${NPM_AUTH_TOKEN}" > .npmrc

# publish to npm registry
yarn dist
cd dist
yarn publish --access public
