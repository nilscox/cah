# Master data documentation

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

## Question

```
{
    id: number,
    lang: string,
    text: string,
    blanks: number[],
}
```

## Choice

```
{
    id: number,
    lang: string,
    text: string,
}
```
