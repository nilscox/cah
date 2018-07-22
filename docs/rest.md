# REST API Documentation

## Player

Login as a new or existing player.

```
POST /api/player
status: 200 | 201
returns: PlayerLight
triggers: PLAYER_CONNECTED
body: {
    nick: string,
}
```

***

Fetch the currently logged in player.

```
GET /api/player
status: 200
returns: PlayerLight | Player
```

***

Log out the currently logged in player.

```
POST /api/player/login
status: 204
triggers: PLAYER_DISCONNECTED
```

***

Change the current player's avatar.

```
PUT /api/player/avatar
status: 200
returns: Player
triggers: PLAYER_AVATAR_CHANGED
```

## Game

Create a new game.

```
POST /api/game
status: 201
returns: Game
body: {
    lang: string,
}
```

- lang: the game's language

***

Fetch the current player's game.

```
GET /api/game
status: 200
returns: Game
```

***

Fetch the current player's game history.

```
GET /api/game/history
status: 200
returns: GameTurn[]
```

***

Join a game.

```
POST /api/game/join/:id
status: 200
returns: Game
```

***

Leave the currently joined game.

```
POST /api/game/leave
status: 204
```

***

Start a game.

```
POST /api/game/start
status: 200
returns: Game
```

> If the game is started, the current turn is not included, only finished ones
> are.

***

End the current game turn and start the next one.

```
POST /api/game/next
status: 200
returns: Game
```

## Answer

Submit an answer to a question. `ids` is an array of the `Choice` ids.
This route represents a `PlayerLight` giving a set of his white cards to the question master.

```
POST /api/answer
status: 200
returns: AnsweredQuestion
body: {
    ids: integer[],
}
```

- ids: the list of `AnsweredQuestion`'s ids.

> For consistency with the number of choices, `id` can be used instead of `ids`.

***

Select a set of choices in the submitted propositions. `id` is the id of the selected AnsweredQuestion.
This route represents the question master selecting is favorite set of white
cards within all white cards submitted by the players.

```
POST /api/answer/select/:id
status: 200
returns: AnsweredQuestion
```
