# Websocket API Documentation

Websocket endpoint listens on the same port as the API.
All websocket events contain a `type` key, along with some information about the event that happened.

There are 2 types of websocket events:

- player events (the ones sent to the players, with partial informations)
- admin events (the ones sent to the admins, with full informations)

The same events type are sent to players and admin, but with a different payload. This is the documentation for the player events. Admin websocket events are documented [here](./websocket-admin.md).

## Player connection

*`PLAYER_CONNECTED`*

```
{
  type: "PLAYER_CONNECTED",
}
```

---