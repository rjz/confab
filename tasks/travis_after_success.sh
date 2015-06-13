#!/bin/bash

set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

GIT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

[ "$GIT_BRANCH" == 'master' ] || {
  echo "Skipping post-build tasks for $GIT_BRANCH"
  exit 0;
}

$DIR/rebuild-gh-pages.sh

cat coverage/lcov.info | coveralls

