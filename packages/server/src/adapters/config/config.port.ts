export interface ConfigPort {
  server: {
    host: string;
    port: number;
  };
  database: {
    url: string;
  };
}
