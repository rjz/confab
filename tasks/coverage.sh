#!/bin/bash

set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
NPMBINDIR="${DIR}/../node_modules/.bin"
COVERAGEDIR="${DIR}/coverage"

rm -rf "${COVERAGEDIR}"

# Generate coverage files
NODE_ENV=test ${NPMBINDIR}/istanbul cover \
  ${NPMBINDIR}/jasmine-node test/ \
  --dir="${COVERAGEDIR}" \
  --print=none \
  --report=none

# Generate report
${NPMBINDIR}/istanbul report lcov html text-summary \
  --input="${COVERAGEDIR}"

