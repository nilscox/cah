# Cards Against Humanity

Black cards, white cards, much fun.

## API Documentation

### Player

`FullPlayer` is a player, seen by himself.
`Player` is a player, seen by other players.

#### Data

```
FullPlayer: {
    nick: string,
    score: integer,
    cards: Choice[],
    submitted: FullAnsweredQuestion | null,
}
```

```
Player: {
    nick: string,
    score: integer | null,
}
```

- nick: The player's nickname
- score: His score
- cards: The set of white cards he owns
- submitted: The set of white cards he submitted, if any

> Note: a Player is returned instead of a FullPlayer when he is not in game

#### Routes

```
POST /api/player
returns: Player
body: {
    nick: string,
}
```

Login as a new or existing player.

```
GET /api/player
returns: Player | FullPlayer
```

Fetch the currently logged in player.

```
DELETE /api/player
returns: {}
```

Log out (the player is not actually deleted).

### Game

A game is the core data structure. It represent a running game of CAH.

#### Data

```
Game: {
    id: integer,
    state: string,
    owner: string,
    players: Player[],
    current_player: string,
    question: Question | null,
    propositions: AnsweredQuestion[],
}
```

- id: The game's id
- state: One of `["idle", "started", "finished"]`
- owner: The owner's nickname
- players: A list of `Player` who joined this game
- current_player: The nickname of the player who either waits for the other
players answers, or have to choose between one
- question: The current black card
- propositions: The set of answers given by the players (empty if not all
players have answered yet)

#### Routes

```
POST /api/game
returns: Game
body: {}
```

Create a new game.

```
GET /api/game
return: Game
```

Fetch the current player's game

```
POST /api/game/join/:id
return: Game
```

Join a game.

```
POST /api/game/leave
returns: {}
```

Leave a game.

```
POST /api/game/start
returns: Game
```

Start a game.

### Question

A question represents a black card. It contains a question, or a sentence
possibly with blanks in it.

```
Question: {
    id: integer,
    text: string,
    nb_choices: integer,
}
```

- id: The question's id
- text: The actual question, with blanks filled with `...` (if any)
- nb_choices: The number of choices that fits the question

### Choice

A choice represents a white card. It contains one or more words that could
answer a `Question`, or fit in a `Question`'s blank.

```
Choice: {
    id: integer,
    text: string,
}
```

- id: The choice's id
- text: The actual choice text

### Answer

An answer is one white card given to answer (or fill) a `Question`.

```
Answer: {
    choice: Choice,
    place: integer,
    length: integer,
}
```

- choice: The black card answered
- position: The starting place of the choice's text in the question's text
- length: The choice's text length

### AnsweredQuestion

An answer given to a `Question` by a `Player`, containing one or more `Answer`.

#### Data

```
FullAnsweredQuestion: {
    id: integer,
    question: Question,
    text: string,
    choices: Answer[],
    answered_by: string,
    won_by: string | null,
}
```

```
AnsweredQuestion: {
    id: integer,
    question: Question,
    text: string,
    choices: Answer[],
}
```

- id: The answer's id
- question: The question to which the player answered
- text: The final text of the question, with blanks filled with choice's
- choices: The submitted choices
- answered_by: The player who answered the question
- won_by: The player won the black card, if any

#### Routes

```
POST /api/answer
returns: FullAnsweredQuestion
body: {
    ids: integer[],
}
```

Submit an answer to a question. `ids` is an array of the `Choice` ids.

```
POST /api/answer/select/:id
returns: FullAnsweredQuestion
body: {
    id: integer,
}
```
