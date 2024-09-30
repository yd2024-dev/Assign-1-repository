import { MongoClient } from 'mongodb';
import fs from 'fs';

const uri = 'mongodb://mongo:27017'; // Adjust if necessary
const dbName = 'yourDatabaseName'; // Replace with your database name
const collectionName = 'books';

async function importBooks() {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db(dbName);
        const collection = database.collection(collectionName);

        // Read the JSON file
        const data = fs.readFileSync('mcmasteful-book-list.json', 'utf-8');
        const books = JSON.parse(data);

        // Insert books into the database
        const result = await collection.insertMany(books);
        console.log(`${result.insertedCount} books added to the database.`);
    } catch (error) {
        console.error('Error importing books:', error);
    } finally {
        await client.close();
    }
}

importBooks().catch(console.error);
