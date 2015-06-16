#!/bin/bash

set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

[ "$TRAVIS_PULL_REQUEST" == 'false' && "$TRAVIS_BRANCH" == 'master' ] || {
  echo "Skipping post-build tasks for pull request"
  exit 0;
}

$DIR/rebuild-gh-pages.sh

cat coverage/lcov.info | coveralls

