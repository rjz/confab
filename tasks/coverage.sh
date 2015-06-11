#!/bin/bash

set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
NPMDIR="$DIR/../node_modules/"
TESTCMD="$NPMDIR/mocha/bin/_mocha"
TESTARGS="--report lcovonly"

$NPMDIR/.bin/istanbul cover $TESTCMD $TESTARGS && cat "$DIR/../coverage/lcov.info" | $NPMDIR/.bin/coveralls

