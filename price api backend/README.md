# purple-avito-salut-backend

### Deploy
`cd deploy`
<br>
`make start` or `docker-compose up`
<br>

#### Apply migration to DB
Linux/macOS
<br>
`goose -dir deploy/migrations postgres "postgresql://postgres:postgres@localhost:5432/postgres" up`
<br>
Windows
<br>
`goose -dir deploy\migrations postgres "postgresql://postgres:postgres@localhost:5432/postgres" up`