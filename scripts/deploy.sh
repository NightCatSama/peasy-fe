#!/bin/bash

# This script is used to deploy the application to the server.
# It is called by the deploy stage in the .travis.yml file.

npm run build
git add .
git commit -m "chore: build"
git push origin main

npm run build:template

cd ./peasy-be

git add .
git commit -m "chore: build"
git push origin main

exit 1