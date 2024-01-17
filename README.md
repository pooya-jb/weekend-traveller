## Introduction

Project of choice to graduate the Codeworks.me web developer bootcamp. This app was built within one week.

Simple one-page app to see flights from any airport to all other connected reports, sorted by price. 
Ideal when planning weekend trips or summar vacation abroad and you are not sure when exactly or where.

![image](https://github.com/DanielMaczak/weekend-traveller/assets/145442574/ae2eb114-aed9-4147-93d0-dbcf4ad4c0ff)

### Server features

1. Follows MVC pattern
2. API data structure separated from front-end logic
3. Cron job for refresh of static resources
4. Centralized error handling

### Client features

1. Centralized constants
2. Loaded results are cached to avoid duplicate API calls
3. Unit and integration tests

## Installation

1. Run `npm i` in both `client` and `server` folders.
2. Create the `.env` file in `server` based on the example.
3. Update server address in `client` in constants service (`src/services/const.service.tsx`).
4. Start the database service, and run `npm run dev` script in both `client` and `server` folders to see the app live in your browser.

### Dependencies

The application works with Postgres DB via Sequelize so it should be possible to switch to other DBs if supported by Sequelize.
You can adjust the `server` connection properties in `src/databases/flightData.database.ts`.

### Frameworks

Server: Express, Node-Cron, Sequelize (with Postgres)

Client: React (with Vite), Vitest

## Room for improvement

Possible extra features:
1. The app contains code to search individual flight details in both front- and back-end, but I didn't have time to implement the display.
2. Back-end should have system for logging processing of requests.
3. The app could be made responsive.
4. Error popups in front-end could use a nice custom message box.
