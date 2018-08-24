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

if [ -n "$CAH_MEDIA_PATH" ]; then
  mkdir -p "$CAH_MEDIA_PATH"
  mkdir -p "/tmp/avatars"
  ln -sf "/tmp/avatars" "$CAH_AVATARS_PATH"
fi

export CAH_SESSION="default"

function session {
  if [ -z "$1" ]; then
    echo "usage: $0 <name>"
    return 1
  fi

  export CAH_SESSION="$1"
}
