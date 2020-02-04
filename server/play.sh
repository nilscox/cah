#!/bin/bash

. ./game.sh

rm -f /tmp/http-{nils,vio,mano,raspout}.json

user=nils post /api/auth/signup nick=nils
user=vio post /api/auth/signup nick=vio
user=mano post /api/auth/signup nick=mano
user=raspout post /api/auth/signup nick=raspout

user=nils post /api/game/new
user=vio post /api/game/join gameId=ABCD
user=mano post /api/game/join gameId=ABCD
user=raspout post /api/game/join gameId=ABCD

user=nils post /api/game/start

user=vio post /api/game/answer cards:=$'["C12"]'
user=mano post /api/game/answer cards:=$'["C23"]'
user=raspout post /api/game/answer cards:=$'["C34"]'
user=nils post /api/game/select answerIndex:=0

user=nils post /api/game/answer cards:=$'["C01", "C02"]'
user=mano post /api/game/answer cards:=$'["C24", "C25"]'
user=raspout post /api/game/answer cards:=$'["C35", "C36"]'
user=vio post /api/game/select answerIndex:=0

get '/api/game?gameId=ABCD'
