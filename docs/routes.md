# REST API

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| GET    | /api/player | Fetch the currently logged in player. |
| DELETE | /api/player | Log out (the player is not actually deleted). |
| PUT    | /api/player/avatar | Change the current player's avatar. |
| POST   | /api/game | Create a new game. |
| GET    | /api/game | Fetch the current player's game. |
| GET    | /api/game/history | Fetch the current player's game history. |
| POST   | /api/game/join/:id | Join a game. |
| POST   | /api/game/leave | Leave the currently joined game. |
| POST   | /api/game/start | Start a game. |
| POST   | /api/game/next | End the current game turn and start the next one. |
| POST   | /api/answer | Submit an answer to a question. |
| POST   | /api/answer/select/:id | Select a set of choices in the submitted propositions. |

# Admin

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| GET    | /api/admin/<model> | retrieve all objects
| GET    | /api/admin/<model>/<id> | retrieve a specific object
| POST   | /api/admin/<model> | create a new object
| PUT    | /api/admin/<model>/<id> | update an existing object
| PATCH  | /api/admin/<model>/<id> | partial update an existing object
| DELETE | /api/admin/<model>/<id> | delete an existing object
