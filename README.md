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
    connected: boolean,
    cards: Choice[],
    submitted: FullAnsweredQuestion | null,
}
```

```
Player: {
    nick: string,
    score: integer | null,
    connected: boolean,
}
```

- nick: The player's nickname
- score: His score, if he is in game
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
    question_master: string,
    question: Question | null,
    propositions: AnsweredQuestion[],
}
```

- id: The game's id
- state: One of `["idle", "started", "finished"]`
- owner: The owner's nickname
- players: A list of `Player` who joined this game
- question_master: The nickname of the player who either waits for the other players answers, or have to choose between one
- question: The current black card
- propositions: The set of answers given by the players

> The propositions array is empty when not all player have submitted an answer.

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
    type: string,
    text: string,
    split: (string | null)[],
    nb_choices: integer,
}
```

- id: The question's id
- type: `"fill"` if the question contain at least one blank else `"question"`
- text: The actual question, with blanks filled with `...` (if any)
- split: The question's text, as an array
- nb_choices: The number of choices that fits the question

> The split field is an array of strings representing the actual question's
> text, and null values representing a blank.

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
}
```

```
FullAnsweredQuestion: {
    id: integer,
    question: Question,
    text: string,
    split: string[],
    answers: Choice[],
    answered_by: string,
    selected_by: string | null,
}
```

- id: The answer's id
- question: The question to which the player answered
- text: The final text of the question, with blanks filled with choice's
- split: The final text of the question, as an array
- choices: The submitted choices
- answered_by: The player who answered the question
- selected_by: The player who selected this choices to answer his question (the former question master)

#### Routes

```
POST /api/answer
returns: FullAnsweredQuestion
body: {
    ids: integer[],
}
```

Submit an answer to a question. `ids` is an array of the `Choice` ids.
This route represents a `Player` giving a set of his black cards to the question master.

> For consistency with the number of choices, `id` can be used instead of `ids`.

```
POST /api/answer/select/:id
returns: FullAnsweredQuestion
```

Select a set of choices in the submitted propositions. `id` is the id of the selected AnsweredQuestion.
This route represents the question master selecting is favorite set of black
cards within all black cards submitted by the other players.
