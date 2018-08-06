#!/bin/sh

export HTTP_SESSION="default"

function session { export HTTP_SESSION="$1"; login "nick=${HTTP_SESSION}" }
function h() { http --session "/tmp/httpie.${HTTP_SESSION}.session" -v $@ }

alias players='h :4242/api/player'
alias games='h :4242/api/game'
function player() { h ":4242/api/player/$1" }
function game() { h ":4242/api/game/$1" }

alias login='h POST :4242/api/player/login'
alias logout='h POST :4242/api/player/logout'

alias me='h :4242/api/player/me'

alias create_player='h POST :4242/api/player'
alias create_game='h POST :4242/api/game'

function game_join() { h POST ":4242/api/game/$1/join" }
function game_start() { h POST ":4242/api/game/$1/start" }
function game_answer() { h POST ":4242/api/game/$1/answer" }
function game_select() { h POST ":4242/api/game/$1/select" }
function game_next() { h POST ":4242/api/game/$1/next" }
