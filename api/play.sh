#!/usr/bin/env sh

function cah() {
  http --session "/tmp/httpie-cah-$1.json" "$2" "http://localhost:4242$3" "${@:4}"
}

reset() {
  yarn cah reset

  cah nils POST /login nick=nils
  cah tom POST /login nick=tom
  jeanneId=$(cah jeanne POST /login nick=jeanne -b | jq -r .id)

  cah nils POST /game

  cah tom POST /game/6666/join
  cah jeanne POST /game/6666/join

  cah tom POST /start questionMasterId="$jeanneId" turns:=20
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
