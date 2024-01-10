declare global {
  namespace NodeJS {
    interface ProcessEnv {
      //  Webserver setup
      SERVER_URL: string;
      SERVER_PORT: number;

      //  Client setup
      CLIENT_URL: string;
      CLIENT_PORT: number;

      //  API connection
      SKYSCANNER_API_KEY: string;
    }
  }
}

export { ProcessEnv };
