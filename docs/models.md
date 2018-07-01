# Models Documentation

## Question

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

## Choice

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

## Player

`Player` is a player, seen by himself.
`PlayerLight` is a player, seen by other players.

> Note: a PlayerLight is returned instead of a Player when he is not in game

```
Player: {
    nick: string,
    connected: boolean,
    avatar: string | null,
    score: integer | null,
    cards: Choice[],
    submitted: AnsweredQuestion | null,
}
```

```
PlayerLight: {
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

## Game

A game is the core data structure. It represent a running game of CAH.

```
Game: {
    id: integer,
    lang: string,
    state: string,
    play_state: string | null,
    owner: string,
    players: PlayerLight[],
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
- players: a list of all the `PlayerLight`s who joined this game
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

## AnsweredQuestion

An answer given to a `Question` by a `Player`, containing one or more `Choice`.

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
