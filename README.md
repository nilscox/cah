# Cards Against Humanity

Black cards, white cards, much fun.

## REST API Documentation

### Question

A question represents a black card. It contains a question, or a sentence
possibly with blanks in it.

```
Question: {
    id: integer,
    type: string,
    text: string,
    split: (string | null)[],
    nb_choices: integer,
}
```

- id: the question's id
- lang: the question's language
- type: `"fill"` if the question contain at least one blank else `"question"`
- text: the actual question, with blanks filled with `...` (if any)
- split: the question's text, as an array
- nb_choices: the number of choices that fits the question

> The split field is an array of strings representing the actual question's
> text, and null values representing a blank.

### Choice

A choice represents a white card. It contains a chunk of text that could answer
a `Question`, or fit in a `Question`'s blank.

```
Choice: {
    id: integer,
    text: string,
}
```

- id: The choice's id
- text: The actual choice text

### Player

`FullPlayer` is a player, seen by himself.
`Player` is a player, seen by other players.

> Note: a Player is returned instead of a FullPlayer when he is not in game

#### Data

```
FullPlayer: {
    nick: string,
    connected: boolean,
    avatar: string | null,
    score: integer,
    cards: Choice[],
    submitted: AnsweredQuestion | null,
}
```

```
Player: {
    nick: string,
    connected: boolean,
    avatar: string | null,
    score: integer | null,
}
```

- nick: the player's nickname
- connected: true if the player is currently connected
- avatar: his avatar's public url
- score: his score, if he is in game
- cards: the set of white cards he owns
- submitted: the answer he submitted, if any

#### Routes

```
POST /api/player
status: 200 | 201
returns: Player
triggers: PLAYER_CONNECTED
body: {
    nick: string,
}
```

Login as a new or existing player.

```
GET /api/player
status: 200
returns: Player | FullPlayer
```

Fetch the currently logged in player.

```
DELETE /api/player
status: 204
triggers: PLAYER_DISCONNECTED
```

Log out (the player is not actually deleted).

```
PUT /api/player/avatar
status: 200
returns: FullPlayer
triggers: PLAYER_AVATAR_CHANGED
```

Change the current player's avatar.

### Game

A game is the core data structure. It represent a running game of CAH.

#### Data

```
Game: {
    id: integer,
    lang: string,
    state: string,
    play_state: string | null,
    owner: string,
    players: Player[],
    question_master: string,
    question: Question | null,
    propositions: PartialAnsweredQuestion[] | null,
}
```

- id: the game's id
- lang: the game's language
- state: one of `["idle", "started", "finished"]`
- play_state: one of `["players_answer", "question_master_selection", "end_of_turn"]`
- owner: the owner's nickname
- players: a list of all the `Player`s who joined this game
- question_master: the question master's nick
- question: the current black card, if any
- propositions: the set of answers given by the players

> The propositions array is empty when not all player have submitted an answer.

```
GameTurn: {
    number: integer,
    question_master: string,
    winner: string,
    question: Question,
    answers: LightAnsweredQuestion[],
}
```

- number: the turn's number (starting from one)
- question_master: the question master's nick for this turn
- winner: the winner's nick
- question: the question
- answers: all the answers submitted

#### Routes

```
POST /api/game
status: 201
returns: Game
body: {
    lang: string,
}
```

- lang: the game's language

Create a new game.

```
GET /api/game
status: 200
returns: Game
```

Fetch the current player's game

```
GET /api/game/history
status: 200
returns: GameTurn[]
```

Fetch the game history

```
POST /api/game/join/:id
status: 200
returns: Game
```

Join a game.

```
POST /api/game/leave
status: 204
```

Leave a game.

```
POST /api/game/start
status: 200
returns: Game
```

Start a game.

> If the game is started, the current turn is not included, only finished ones
> are.

```
POST /api/game/next
status: 200
returns: Game
```

End the current game turn and start the next one.

### AnsweredQuestion

An answer given to a `Question` by a `Player`, containing one or more `Choice`.

#### Data

```
AnsweredQuestion: {
    id: integer,
    question: Question,
    text: string,
    split: string[],
    answers: Choice[],
    answered_by: string,
    selected_by: string | null,
}
```

```
PartialAnsweredQuestion: {
    id: integer,
    question: Question,
    text: string,
    split: string[],
    answers: Choice[],
}
```

```
LightAnsweredQuestion: {
    id: integer,
    text: string,
    split: string[],
    answers: Choice[],
    answered_by: string,
}
```

- id: the answer's id
- question: the question to which the player answered
- text: the final text of the question, with blanks filled with choice's
- split: the final text of the question, as an array
- answers: the submitted choices
- answered_by: the player who answered the question
- selected_by: the player who selected this choices to answer his question
(the former question master), if any

#### Routes

```
POST /api/answer
status: 200
returns: AnsweredQuestion
body: {
    ids: integer[],
}
```

Submit an answer to a question. `ids` is an array of the `Choice` ids.
This route represents a `Player` giving a set of his white cards to the question master.

> For consistency with the number of choices, `id` can be used instead of `ids`.

```
POST /api/answer/select/:id
status: 200
returns: AnsweredQuestion
```

Select a set of choices in the submitted propositions. `id` is the id of the selected AnsweredQuestion.
This route represents the question master selecting is favorite set of white
cards within all white cards submitted by the players.

## Websocket API Documentation

Websocket endpoint listens on the same port as the API.
All websocket events contain a `type` key, along with some information about the event that happened.

### Player connection

```
event: {
  type: "PLAYER_CONNECTED",
  player: Player,
}
```

```
event: {
  type: "PLAYER_DISCONNECTED",
  nick: string,
}
```

### Player actions

```
event: {
  type: "PLAYER_AVATAR_CHANGED",
  player: Player,
}
```

### Game joining

```
event: {
    type: "PLAYER_JOINED",
    player: Player,
}
```

```
event: {
    type: "PLAYER_LEFT",
    player: Player,
}
```

### Game actions

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

## Master data documentation

When creating a new game, `Questions` and `Choices` are loaded from a _master_
database. Thus, every time a game is created, `Questions` and `Choices` are
copied from the master database and attached to the newly created game.

The master REST API allows access to the master data.

All the routes for a specific master data model can be accessed from
`/api/master/<model>` with `<model>` being either `question` or `choice`. When
retrieving a model or a list of models (using the `GET` method), a `lang` query
parameter can be provided in order to filter results to a specific language.

Available routes are:

- `GET /api/master/<model>`: retrieve all the `<model>`s.
- `GET /api/master/<model>/:id`: retrieve a specific `<model>` from its `id`
- `POST /api/master/<model>`: create a new `<model>`
- `PUT /api/master/<model>/:id`: update a `<model>`
- `PATCH /api/master/<model>/:id`: partial update a `<model>`
- `DELETE /api/master/<model>/:id`: delete an existing `<model>`

> Note: the `PATCH` request allows to partially update a model. Fields that are
> not provided in the request body will not be updated.

### Question

```
{
    id: number,
    lang: string,
    text: string,
    blanks: number[],
}
```

### Choice

```
{
    id: number,
    lang: string,
    text: string,
}
```

## Admin API documentation

The admin API allows complete control over CAH's system. It can be used to
control master data with CRUD routes, view and control running games, send
websocket messages to specific players or games... All sensible routes require
an authentication, in order to preserve us from anarchy and chaos.

All admin routes are prefixed with `/api/admin`.

### CRUD routes

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
next section ([Other routes](#other routes)).

The objects that allow access over the CRUD endpoints are:

- `game`
- `player`

So that you can access the players with ID 3 with:

```
curl -v http://$API_URL/api/admin/player/3
```

### Other routes

Some models provide more endpoints than the ones available via the CRUD routes.

#### Game

```
route: /api/admin/game
method: POST
status: 201
body: {
    owner: string,
}
```

- owner: the owner's nick. He must not be in game.

Create a game, associated with an owner.

```
route: /api/admin/game/<id>/history
method: GET
status: 200
```

Fetch a game's history.
