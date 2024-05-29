declare namespace NodeJS {
  interface ProcessEnv {
    GOOGLE_SERVICE_ACCOUNT_EMAIL: string;
    GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY: string;
    scopes: Array<string>;
  }
}