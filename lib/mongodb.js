import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI; // your MongoDB Atlas URI
const options = {};

let client;
let clientPromise;

if (!process.env.MONGODB_URI) throw new Error('Please add MONGODB_URI to .env.local');

if (process.env.NODE_ENV === 'development') {
  // Prevent multiple connections in dev
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // Production
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
