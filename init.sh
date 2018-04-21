#!/bin/sh

source ./.env

source "$VENV_DIR/bin/activate"
source "$NVM_DIR/nvm.sh"

mkdir -p "$CAH_AVATARS_DIR"

API_URL="$CAH_API_LISTEN_IP:$CAH_API_LISTEN_PORT"
WEB_URL="$CAH_WEB_LISTEN_IP:$CAH_WEB_LISTEN_PORT"

export CAH_DB_NAME
export CAH_DB_USER
export CAH_DB_PASSWORD
export CAH_DB_HOST
export CAH_DB_PORT

export CAH_DB_ROOT_USER

export CAH_DATA_PATH
export CAH_AVATARS_DIR

export CAH_API_ALLOWED_HOSTS="localhost;127.0.0.1;$CAH_API_LISTEN_IP"
export CAH_API_CORS_ORIGIN_WHITELIST="$WEB_URL"

export REACT_APP_API_URL="http://$API_URL"
export REACT_APP_WEBSOCKET_URL="ws://$API_URL"

runsql() {
  echo "$1" | psql -U "$CAH_DB_ROOT_USER" -h "$CAH_DB_HOST"
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
    [ -n "$1" ] && $CAH_API_LISTEN_IP="$1"
    [ -n "$2" ] && $CAH_API_LISTEN_PORT="$2"
    python manage.py runserver $CAH_API_LISTEN_IP:$CAH_API_LISTEN_PORT
}

ws() {
  http POST "localhost:8000/api/debug/ws_$1/$2" "message=$3"
}
