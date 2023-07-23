export interface ConfigPort {
  server: {
    host: string;
    port: number;
  };

  data: {
    path: string;
  };

  database: {
    url: string;
    debug: boolean;
  };
}
