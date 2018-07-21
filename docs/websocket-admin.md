# Websocket API Documentation

Be sure you read the player websocket docs. This is the documentation for the admin events. Player websocket events are documented [here](./websocket.md).

## Player connection

**`PLAYER_CONNECTED`**

```
{
  type: "PLAYER_CONNECTED",
  player: FullPlayer,
}
```

---

**`PLAYER_DISCONNECTED`**

```
{
  type: "PLAYER_DISCONNECTED",
  player: fullPlayer,
}
```

## Player avatar

**`PLAYER_AVATAR_CHANGED`**

```
{
  type: "PLAYER_AVATAR_CHANGED",
  player: FullPlayer,
}
```

## Player cards

**`PLAYER_CARDS_DEALT`**

```
{
  type: "PLAYER_CARDS_DEALT",
  player: FullPlayer,
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
  game: FullGame,
  nick: string,
}
```

---

**`GAME_PLAYER_LEFT`**

```
{
  type: "GAME_PLAYER_LEFT",
  game: FullGame,
  nick: string,
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
  game: FullGame,
  nick: string,
}
```

---

**`GAME_ALL_ANSWERS_SUBMITTED`**

```
{
  type: "GAME_ALL_ANSWERS_SUBMITTED",
  game: FullGame,
}
```

---

**`GAME_ANSWER_SELECTED`**

```
{
  type: "GAME_ANSWER_SELECTED",
  game: FullGame,
  turn: GameTurn,
}
```
