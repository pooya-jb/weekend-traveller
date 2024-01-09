declare global {
  namespace NodeJS {
    interface ProcessEnv {
      //  Webserver setup
      URL: string;
      PORT: number;
    }
  }
}

export { ProcessEnv };
