import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URL;

if (!MONGODB_URI) {
  // Do not throw here to avoid breaking environments without DB during static analysis,
  // but connections will fail fast when attempted.
  // Consumers should call connectToDatabase() which will throw if missing.
}

type Cached = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  // allow attaching to globalThis in Node environment
  // eslint-disable-next-line @typescript-eslint/no-namespace
  var _mongooseConnection: Cached | undefined;
}

if (!global._mongooseConnection) {
  global._mongooseConnection = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URL is not set in environment");
  }

  const cached = global._mongooseConnection!;

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        // useUnifiedTopology and useNewUrlParser are defaults in mongoose >=6
      })
      .then(() => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

