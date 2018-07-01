# Admin API documentation

The admin API allows complete control over CAH's system. It can be used to
control master data with CRUD routes, view and control running games, send
websocket messages to specific players or games... All sensible routes require
an authentication, in order to preserve us from anarchy and chaos.

All admin routes are prefixed with `/api/admin`.

## CRUD routes

`create`, `read`, `update` and `delete` objects are the essentials operations
provided by CRUD routes. Some of CAH's objects (aka. models) are availible via
CRUD endpoints.

All CRUD routes allow theses methods:
```
GET    /api/admin/<model>: retrieve all objects
GET    /api/admin/<model>/<id>: retrieve a specific object
POST   /api/admin/<model>: create a new object
PUT    /api/admin/<model>/<id>: update an existing object
PATCH  /api/admin/<model>/<id>: partial update an existing object
DELETE /api/admin/<model>/<id>: delete an existing object
```

> Note: partial updating allows to provide only some part of an object. The
> payload sent with the request will be merged with the existing model
> instance, and saved to the database.

For instance, you can access the players with nick `raspout` with:

```
curl -v http://$API_URL/api/admin/player/raspout
```

Some objects handle requests with a few specific behaviour that are detailed in
the next section.

## Models

### Game

Create a game, associated with an owner. This overrides the default POST
request.

```
route: /api/admin/game
method: POST
status: 201
body: {
    owner: string,
    lang: string,
}
```

- owner: the owner's nick. He can not be in game.
- lang: the game's language.

***

Fetch a game's history.

```
route: /api/admin/game/<id>/history
method: GET
status: 200
```

***

Add a player to a game.

```
route: /api/admin/game/<id>/join
method: POST
status: 200
body: {
    player: string,
}
```

- player: the player's nick.

***

Remove a player from a game.

```
route: /api/admin/game/<id>/leave
method: POST
status: 200
body: {
    player: string,
}
```

- player: the player's nick.

### Player

The model used in the admin routes is a `FullPlayer`.

```
FullPlayer: {
    nick: string,
    socketId: string | null,
    avatar: string | null,
    connected: boolean,
    inGame: boolean,
    gameId: number | null,
    score: integer | null,
    cards: Choice[],
    hasPlayed: boolean,
    submitted: AnsweredQuestion | null,
}
```

***

Change a player's avatar image.

```
route: /api/admin/player/<nick>/avatar
method: POST
status: 200
body: {
    avatar: Image,
}
```

- avatar: the avatar image.

> Note : this is a file upload endpoint.
