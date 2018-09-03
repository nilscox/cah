# CAH Environment varibales

| variable              | description                           | template value                   |
|:----------------------|:--------------------------------------|:---------------------------------|
| NVM_DIR               | node version manager directory        | "$HOME/.nvm"                     |
| CAH_BASEDIR           | project root directory                | "$HOME/some/where"               |
| CAH_DB_CONTAINER_NAME | database docker container name        | "postgres"                       |
| CAH_DB_NAME           | database name                         | "cah"                            |
| CAH_DB_USER           | database user                         | "cah"                            |
| CAH_DB_PASSWORD       | database password                     | "cah"                            |
| CAH_DB_HOST           | database host (ip or hostname)        | "postgres"                       |
| CAH_DB_PORT           | database port                         | "5432"                           |
| CAH_DB_ROOT_USER      | database root user (for testing only) | "postgres"                       |
| CAH_DB_ROOT_PASSWORD  | database root password                | "postgres"                       |
| CAH_DATA_PATH         | data path                             | "$CAH_BASEDIR/data"              |
| CAH_MEDIA_PATH        | media path                            | "$CAH_BASEDIR/media"             |
| CAH_MEDIA_ROOT        | media root url                        | "/media"                         |
| CAH_API_IP            | server listen ip                      | "0.0.0.0"                        |
| CAH_API_PORT          | server listen port                    | "4242"                           |
| CAH_API_ADMIN_TOKEN   | admin token                           | "toquèn"                         |
| CAH_API_LOG_REQUEST   | request log file                      | "$CAH_BASEDIR/logs/request.log"  |
| CAH_API_LOG_DATABASE  | sql log file                          | "$CAH_BASEDIR/logs/database.log" |
| CAH_API_LOG_SERVER    | server log file                       | "$CAH_BASEDIR/logs/server.log"   |
| CAH_ADMIN_IP          | admin listen ip                       | "localhost"                      |
| CAH_ADMIN_PORT        | admin listen port                     | "7777"                           |
