// data-source.ts
import { DataSource } from "typeorm";

export const AppDataSource = (
  host: string,
  port: number,
  username: string,
  password: string,
  database: string,
) =>
  new DataSource({
    type: "postgres",
    host: host,
    port: port,
    username: username,
    password: password,
    database: database,
    synchronize: false,
    logging: false,
    entities: ["src/entity/**/*.ts"],
    migrations: ["src/migration/**/*.ts"],
    subscribers: ["src/subscriber/**/*.ts"],
    extra: {
      max: 20, // default is 10
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    },
  });
