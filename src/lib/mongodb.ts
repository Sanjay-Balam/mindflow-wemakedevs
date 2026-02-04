import { MongoClient, Db } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

interface GlobalMongo {
  conn: MongoClient | null;
  promise: Promise<MongoClient> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var _mongo: GlobalMongo | undefined;
}

let cached = global._mongo;

if (!cached) {
  cached = global._mongo = { conn: null, promise: null };
}

export async function connectToDatabase(): Promise<MongoClient> {
  if (cached!.conn) {
    return cached!.conn;
  }

  if (!cached!.promise) {
    cached!.promise = MongoClient.connect(MONGODB_URI!);
  }

  cached!.conn = await cached!.promise;
  return cached!.conn;
}

export async function getDb(): Promise<Db> {
  const client = await connectToDatabase();
  return client.db("mindflow");
}

export default connectToDatabase;
