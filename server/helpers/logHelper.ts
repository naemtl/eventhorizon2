import { MongoClient } from 'mongodb';

const url = 'mongodb://localhost:27017';
const dbName = 'EventHorizon';
const collectionName = 'error_logs';

const client = new MongoClient(url);

export const writeLog = async (log) => {
    try {
        await client.connect();
        const db = client.db(dbName);
        const logsCollection = db.collection(collectionName);
        await logsCollection.insertOne(log);
        console.error('Log written to MongoDB', log);
    } catch (error) {
        console.error('Failed to write log to MongoDB:', error);
    }
}