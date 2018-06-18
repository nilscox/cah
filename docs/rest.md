# REST API Documentation

## Question

A question represents a black card. It contains a question, or a sentence
possibly with blanks in it.

### Data

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

## Choice

A choice represents a white card. It contains a chunk of text that could answer
a `Question`, or fit in a `Question`'s blank.

### Data

```
Choice: {
    id: integer,
    text: string,
}
```

- id: The choice's id
- text: The actual choice text

## Player

`FullPlayer` is a player, seen by himself.
`Player` is a player, seen by other players.

> Note: a Player is returned instead of a FullPlayer when he is not in game

### Data

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

### Routes

Login as a new or existing player.

```
POST /api/player
status: 200 | 201
returns: Player
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
returns: Player | FullPlayer
```

***

Log out (the player is not actually deleted).

```
DELETE /api/player
status: 204
triggers: PLAYER_DISCONNECTED
```

***

Change the current player's avatar.

```
PUT /api/player/avatar
status: 200
returns: FullPlayer
triggers: PLAYER_AVATAR_CHANGED
```

## Game

A game is the core data structure. It represent a running game of CAH.

### Data

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

### Routes

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

Fetch the current player's game

```
GET /api/game
status: 200
returns: Game
```

***

Fetch the game history

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

Leave a game.

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

## AnsweredQuestion

An answer given to a `Question` by a `Player`, containing one or more `Choice`.

### Data

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

### Routes

Submit an answer to a question. `ids` is an array of the `Choice` ids.
This route represents a `Player` giving a set of his white cards to the question master.

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
