# Websocket API Documentation

Be sure you read the player websocket docs. This is the documentation for the admin events. Player websocket events are documented [here](./websocket.md).

## Player connection

**`PLAYER_CONNECTED`**

```
{
  type: "PLAYER_CONNECTED",
  nick: string,
}
```

---

**`PLAYER_DISCONNECTED`**

```
{
  type: "PLAYER_DISCONNECTED",
  nick: string,
}
```

## Player avatar

**`PLAYER_AVATAR_CHANGED`**

```
{
  type: "PLAYER_AVATAR_CHANGED",
  nick: string,
  avatar: string,
}
```

## Player cards

**`PLAYER_CARDS_DEALT`**

```
{
  type: "PLAYER_CARDS_DEALT",
  nick: string,
  cards: Choice[],
}
```

## Game creation

**`GAME_CREATED`**

```
{
  type: "GAME_CREATED",
  game: FullGame,
}
```

---

**`GAME_PLAYER_JOINED`**

```
{
  type: "GAME_PLAYER_JOINED",
  nick: string,
  gameId: number,
}
```

---

**`GAME_PLAYER_LEFT`**

```
{
  type: "GAME_PLAYER_LEFT",
  nick: string,
  gameId: number,
}
```

## Game actions

**`GAME_STARTED`**

```
{
  type: "GAME_STARTED",
  game: FullGame,
}
```

---

**`GAME_NEXT_TURN`**

```
{
  type: "GAME_NEXT_TURN",
  game: FullGame,
}
```

---

**`GAME_ANSWER_SUBMITTED`**

```
{
  type: "GAME_ANSWER_SUBMITTED",
  nick: string,
  gameId: number,
  answer: AnsweredQuestion[],
}
```

---

**`GAME_ALL_ANSWERS_SUBMITTED`**

```
{
  type: "GAME_ANSWER_SUBMITTED",
  gameId: number,
}
```

---

**`GAME_ANSWER_SELECTED`**

```
{
  type: "GAME_ANSWER_SELECTED",
  gameId: number,
  turn: GameTurn,
}
```
