#!/bin/sh

export HTTP_SESSION="default"

function session {
  if [ -z "$1" ]; then
    echo "usage: $0 <name>"
    return 1
  fi

  export HTTP_SESSION="$1"
  login "$1"
}

function h() { http --session "/tmp/httpie.${HTTP_SESSION}.session" -v $@ }

function players() { h ":4242/api/player" }
function player() { h ":4242/api/player/$1" }
function games() { h ":4242/api/game" }
function game() { h ":4242/api/game/$1" }

function create_player() { h POST ":4242/api/player" nick="$1" }
function create_game() { h POST ":4242/api/game" lang="$1" nbQuestions:="$2" cardsPerPlayer:="$3" }

function login() { h POST ":4242/api/player/login" nick="$1" }
function logout() { h POST ":4242/api/player/logout" }

function me() { h ":4242/api/player/me" }

function game_join() { h POST ":4242/api/game/$1/join" }
function game_start() { h POST ":4242/api/game/$1/start" }
function game_answer() { h POST ":4242/api/game/$1/answer" ids:="$2" }
function game_select() { h POST ":4242/api/game/$1/select" id:="$2" }
function game_next() { h POST ":4242/api/game/$1/next" }
