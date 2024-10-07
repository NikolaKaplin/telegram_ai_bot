import * as schema from "../db/shema";
import mysql from "mysql2";
import { MySql2Database, drizzle } from "drizzle-orm/mysql2";

export const connection = ((globalThis as any).dbconnection ||
  (() => {
    return ((globalThis as any).dbconnection = mysql.createConnection(
      process.env.DATABASE_URL
    ));
  })()) as mysql.Connection;

export default ((globalThis as any).db ||
  (() =>
    ((globalThis as any).db = drizzle(connection, {
      schema,
      mode: "default",
    })))()) as MySql2Database<typeof schema>;
