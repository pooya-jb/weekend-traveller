# Weekend Traveller

Simple one-page app to see flights from any airport to all other connected reports, sorted by price. 
Ideal when planning weekend trips or summar vacation abroad and you are not sure when exactly or where.

![Weekend Traveller](https://github.com/pooya-jb/weekend-traveller/assets/81810893/bcf8e60d-abb1-4d25-8791-f6065c3e2e76)


### Server features

1. Follows MVC pattern
2. API data structure separated from front-end logic
3. Cron job for refresh of static resources
4. Centralized error handling

### Client features

1. Centralized constants
2. Loaded results are cached to avoid duplicate API calls
3. Unit and integration tests

## Getting started

1. Run `npm i` in both `client` and `server` folders.
2. Create the `.env` file in `server` based on the example.
3. Update server address in `client` in constants service (`src/services/const.service.tsx`).
4. Start the database service, and run `npm run dev` script in both `client` and `server` folders to see the app live in your browser.

### Dependencies

The application works with Postgres DB via Sequelize so it should be possible to switch to other DBs if supported by Sequelize.
You can adjust the `server` connection properties in `src/databases/flightData.database.ts`.

## Tech stack

Server: Express, Node-Cron, Sequelize (with Postgres)

Client: React (with Vite), Vitest
