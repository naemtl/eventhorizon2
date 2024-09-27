import { MongoClient } from 'mongodb'
import { getCasa } from './scrapers/casa.mjs';

const url = 'mongodb://localhost:27017';
const dbName = 'EventHorizon';
const collectionName = 'events';

const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

try {
    await client.connect();
    console.log('Connected successfully to MongoDB');

    const db = client.db(dbName);
    const eventsCollection = db.collection(collectionName);
    const scrapers = [getCasa];
    const result = await Promise.all(scrapers.map(scraper => scraper()));
    const events = await eventsCollection.insertMany(result.flat());

    console.log({ events });
} catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
}