import { Db, MongoClient } from "npm:mongodb@6";
import "jsr:@std/dotenv/load";

const mongoConnectionUrl = Deno.env.get("DENO_MONGO_CONNECTION_URL") ?? "";

let database: Db;

export const connectDB = async () => {
  const client = new MongoClient(mongoConnectionUrl);

  await client.connect();
  database = client.db("deno-todos-app");
  console.log("CONNECTED_SUCCESSFULLY");

  return database;
};

export const getDB = () => database;

export const getDBCollection = (collectionName: string) =>
  database?.collection(collectionName);
