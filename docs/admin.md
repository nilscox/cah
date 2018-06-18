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

Some objects handle requests with a few -- missing word -- that are detailed in the
next section ([other routes](#other-routes)).

The objects that allow access over the CRUD endpoints are:

- `game`
- `player`

So that you can access the players with ID 3 with:

```
curl -v http://$API_URL/api/admin/player/3
```

## Other routes

Some models provide more endpoints than the ones available via the CRUD routes.

### Game

Create a game, associated with an owner.

```
route: /api/admin/game
method: POST
status: 201
body: {
    owner: string,
}
```

- owner: the owner's nick. He can not be in game.

***

Fetch a game's history.

```
route: /api/admin/game/<id>/history
method: GET
status: 200
```
