declare global {
  namespace NodeJS {
    interface ProcessEnv {
      //  Webserver setup
      SERVER_URL: string;
      SERVER_PORT: number;

      //  Client setup
      CLIENT_URL: string;
      CLIENT_PORT: number;

      //  Database setup
      DB_URL: string;
      DB_PORT: number;
      DB_NAME: string;
      DB_USER: string;
      DB_PASS: string;

      //  API connection
      SKYSCANNER_API_KEY: string;
    }
  }
}

export { ProcessEnv };
