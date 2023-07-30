#!/usr/bin/env sh

basedir=$(dirname "$0")
node --no-warnings --experimental-specifier-resolution=node "$basedir/dist/index.js" "$@"
