import { MongoClient } from 'mongodb'
import { getCasa } from './scrapers/casa.mjs';

// MongoDB connection URL
const url = 'mongodb://localhost:27017';
const dbName = 'EventHorizon';  // Change this to your database name
const collectionName = 'events'; // Change this to your collection name

// Create a new MongoClient
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

try {
    // Connect to the MongoDB server
    await client.connect();
    console.log('Connected successfully to MongoDB');

    // Access the database and collection
    const db = client.db(dbName);
    const eventsCollection = db.collection(collectionName);
    const scrapers = [getCasa];
    const result = await Promise.all(scrapers.map(scraper => scraper()));
    const events = await eventsCollection.insertMany(result.flat());

    console.log({ events });
} catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
}