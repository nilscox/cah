#!/usr/bin/env sh

function cah() {
  url="${API_URL:-http://localhost:4242}$3"

  http --session "/tmp/httpie-cah-$1.json" "$2" "$url" "${@:4}"
}

auth() {
  cah nils POST /login nick=nils
  cah tom POST /login nick=tom
  cah jeanne POST /login nick=jeanne
}

join() {
  cah nils POST /game
  cah tom POST "/game/$1/join"
  cah jeanne POST "/game/$1/join"
}

start() {
  jeanneId=$(cah jeanne GET /player/me -b | jq -r .id)
  cah tom POST /start questionMasterId="$jeanneId" turns:="${1:-20}"
}

reset() {
  yarn cah reset
  auth
  join "6666"
  start "$1"
}

answer() {
  cards=$(cah "$1" GET /player/me -b | jq -r .cards)
  selection=()

  for i in $(seq 1 "$2"); do
    selection+=($(echo "$cards" | jq ".[$i].id"))
  done

  cah "$1" POST /answer choicesIds:="[$(echo "$selection" | tr ' ' ',')"]
}

selectWinner() {
  gameId=$(cah nils GET /player/me -b | jq -r .gameId)
  answerId=$(cah "$1" GET "/game/${gameId}" -b | jq -r ".answers[0].id")

  cah "$1" POST /select answerId="$answerId"
}

nextTurn() {
  cah "$1" POST /next
}

play() {
  gameId=$(cah nils GET /player/me -b | jq -r .gameId)
  game=$(cah nils GET "/game/$gameId" -b)
  gameState=$(echo "$game" | jq -r .gameState)

  if [ "$gameState" != 'started' ]; then
    echo "game state is $gameState"
    return
  fi

  playState=$(echo "$game" | jq -r .playState)
  questionMaster=$(echo "$game" | jq -r .questionMaster)
  numberOfBlanks=$(echo "$game" | jq -r .question.numberOfBlanks)

  if [ "$playState" = 'playersAnswer' ]; then
    [ "$questionMaster" != 'nils' ] && answer nils "$numberOfBlanks"
    [ "$questionMaster" != 'tom' ] && answer tom "$numberOfBlanks"
    [ "$questionMaster" != 'jeanne' ] && answer jeanne "$numberOfBlanks"
  fi

  if [ "$playState" = 'questionMasterSelection' ]; then
    selectWinner "$questionMaster"
  fi

  if [ "$playState" = 'endOfTurn' ]; then
    nextTurn "$questionMaster"
  fi
}
