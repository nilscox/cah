#!/bin/bash

api() {
  method="$1"
  route="$2"

  shift; shift

  if [ -n "$user" ]; then
    echo "[$user] $method $route $@"
    http --session="/tmp/http-$user.json" "$method" "http://localhost:4242$route" "$@"
  else
    echo "$method $route $@"
    http "$method" "http://localhost:4242$route" "$@"
  fi
}

get() {
  api GET "$@"
}

post() {
  api POST "$@"
}
