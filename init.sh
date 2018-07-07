#!/bin/sh

source ./.env

source "$VENV_DIR/bin/activate"
source "$NVM_DIR/nvm.sh"

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

export CAH_DATA_PATH
export CAH_MEDIA_PATH
export CAH_AVATARS_PATH

export CAH_API_IP
export CAH_API_PORT

export CAH_WEB_IP
export CAH_WEB_PORT

export CAH_ADMIN_IP
export CAH_ADMIN_PORT

export CAH_API_ADMIN_TOKEN

export CAH_API_ALLOWED_HOSTS="localhost;127.0.0.1;$API_URL;$CAH_API_IP"
export CAH_API_CORS_ORIGIN_WHITELIST="$WEB_URL;$ADMIN_URL"

export REACT_APP_CAH_API_URL=$API_URL
export REACT_APP_CAH_WEBSOCKET_URL=$API_WS_URL
export REACT_APP_CAH_API_ADMIN_TOKEN=$CAH_API_ADMIN_TOKEN

mkdir -p "$CAH_MEDIA_PATH"
mkdir -p "/tmp/avatars"
ln -sf "/tmp/avatars" "$CAH_AVATARS_PATH"

if [ ! -d "$VENV_DIR" ]; then
  python -m venv "$VENV_DIR"
  source "$VENV_DIR/bin/activate"
  pip install -r "requirements.txt"
fi

runsql() {
  echo "$1" | docker exec -i "$CAH_DB_CONTAINER_NAME" psql -U "$CAH_DB_ROOT_USER"
}

resetdb() {
    echo 'killing all db connections'
    runsql "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE pid <> pg_backend_pid() AND datname = 'cah'" > /dev/null

    echo 'rm db migration files'
    rm -rf api/migrations/{0*.py,__pycache__}

    echo 'rm master db migration files'
    rm -rf master/migrations/{0*.py,__pycache__}

    echo 'drop database'
    runsql "DROP DATABASE cah; CREATE DATABASE cah; GRANT ALL ON DATABASE cah TO cah;"

    echo 'makemigrations'
    python manage.py makemigrations

    echo 'migrate'
    python manage.py migrate

    if [ ! -f master.original.sqlite3 ] || [ "$1" = "--hard" ]; then
        echo 'drop master database'
        rm master.sqlite3

        echo 'makemigrations master'
        python manage.py makemigrations master

        echo 'migrate master'
        python manage.py migrate --database=master

        echo 'populate master db'
        python manage.py populatedb

        cp master.sqlite3 master.original.sqlite3
    else
        echo 'restore master db from cache'
        cp master.original.sqlite3 master.sqlite3
    fi
}

startapi() {
    python manage.py runserver "$CAH_API_IP:$CAH_API_PORT"
}

ws() {
  http POST "$API_URL/api/debug/ws_$1/$2" "message=$3"
}
