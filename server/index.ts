import { MongoClient } from 'mongodb'

import { getAskAPunk } from './scrapers/askapunk.ts';
import { getBlueSkies } from './scrapers/blueskies.ts';
import { getCasa } from './scrapers/casa.ts';
import { getRavewave } from './scrapers/ravewave.ts';
import { getTurbohaus } from './scrapers/turbohaus.ts';

const url = 'mongodb://localhost:27017';
const dbName = 'EventHorizon';
const collectionName = 'events';

const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

try {
    await client.connect();
    console.log('Connected successfully to MongoDB');

    const db = client.db(dbName);
    const eventsCollection = db.collection(collectionName);
    const scrapers = [getAskAPunk, getBlueSkies, getCasa, getRavewave, getTurbohaus];
    const result = await Promise.all(scrapers.map(scraper => scraper()));
    const events = await eventsCollection.insertMany(result.flat());

    console.log({ events }); // TODO: remove this after development
} catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
}