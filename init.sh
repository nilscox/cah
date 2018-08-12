#!/bin/sh

source ./.env
source "$NVM_DIR/nvm.sh"

export NODE_ENV=development

API_URL="http://$CAH_API_IP:$CAH_API_PORT"
API_WS_URL="ws://$CAH_API_IP:$CAH_API_PORT"
WEB_URL="http://$CAH_WEB_IP:$CAH_WEB_PORT"
ADMIN_URL="http://$CAH_ADMIN_IP:$CAH_ADMIN_PORT"

export CAH_DB_NAME
export CAH_DB_USER
export CAH_DB_PASSWORD
export CAH_DB_HOST
export CAH_DB_PORT

export CAH_DB_ROOT_USER
export CAH_DB_ROOT_PASSWORD

export CAH_API_IP
export CAH_API_PORT

export CAH_WEB_IP
export CAH_WEB_PORT

export CAH_ADMIN_IP
export CAH_ADMIN_PORT

export CAH_API_ADMIN_TOKEN

export CAH_DATA_PATH
export CAH_MEDIA_PATH
export CAH_AVATARS_PATH

export REACT_APP_API_URL="$API_URL"
export REACT_APP_WEBSOCKET_URL="$API_WS_URL"
export REACT_APP_API_ADMIN_TOKEN="$CAH_API_ADMIN_TOKEN"

mkdir -p "$CAH_MEDIA_PATH"
mkdir -p "/tmp/avatars"
ln -sf "/tmp/avatars" "$CAH_AVATARS_PATH"

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

function player() { h ":4242/api/player/$1" }
function game() { h ":4242/api/game/$1" }

function create_player() { h POST ":4242/api/player" nick="$1" }
function login() { h POST ":4242/api/player/login" nick="$1" }
function logout() { h POST ":4242/api/player/logout" }
function me() { h ":4242/api/player/me" }

function g_create() { h POST ":4242/api/game" lang="$1" nbQuestions:="$2" cardsPerPlayer:="$3" }
function g_join() { h POST ":4242/api/game/$1/join" }
function g_start() { h POST ":4242/api/game/$1/start" }
function g_answer() { h POST ":4242/api/game/$1/answer" ids:="$2" }
function g_select() { h POST ":4242/api/game/$1/select" id:="$2" }
function g_next() { h POST ":4242/api/game/$1/next" }
