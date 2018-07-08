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

---
