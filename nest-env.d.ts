declare namespace NodeJS {
  interface ProcessEnv extends Dict<string> {
    readonly NODE_ENV: 'development' | 'test' | 'production';
    readonly PORT: string;
  }
}
