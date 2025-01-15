import * as schema from "./schema";
import mysql from "mysql2";
import { MySql2Database, drizzle } from "drizzle-orm/mysql2";
import env from "../env";

export const connection = ((globalThis as any).dbconnection ||
  (() => {
    return ((globalThis as any).dbconnection = mysql.createConnection(
      env.DATABASE_URL
    ));
  })()) as mysql.Connection;

export default ((globalThis as any).db ||
  (() =>
    ((globalThis as any).db = drizzle(connection, {
      schema,
      mode: "default",
    })))()) as MySql2Database<typeof schema>;
