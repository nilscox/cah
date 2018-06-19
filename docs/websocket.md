# Websocket API Documentation

Websocket endpoint listens on the same port as the API.
All websocket events contain a `type` key, along with some information about the event that happened.

## Player connection

```
event: {
  type: "PLAYER_CONNECTED",
  player: PlayerLight,
}
```

```
event: {
  type: "PLAYER_DISCONNECTED",
  nick: string,
}
```

## Player actions

```
event: {
  type: "PLAYER_AVATAR_CHANGED",
  player: PlayerLight,
}
```

## Game joining

```
event: {
    type: "PLAYER_JOINED",
    player: PlayerLight,
}
```

```
event: {
    type: "PLAYER_LEFT",
    player: PlayerLight,
}
```

## Game actions

```
event: {
    type: "GAME_STARTED",
    game: Game,
}
```

```
event: {
    type: "GAME_NEXT_TURN",
    game: Game,
}
```

```
event: {
    type: "CARDS_DEALT",
    cards: Choice[],
}
```

```
event: {
    type: "ANSWER_SUBMITTED",
    nick: string,
}
```

```
event: {
    type: "ALL_ANSWERS_SUBMITTED",
    answers: PartialAnsweredQuestion[],
}
```

```
event: {
    type: "ANSWER_SELECTED",
    answer: AnsweredQuestion,
    answers: AnsweredQuestion[],
}
```
