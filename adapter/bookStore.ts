import { MongoClient, ObjectId } from 'mongodb';
import path from 'path';
import fs from 'fs';

const uri = 'mongodb://mongo:27017'; // MongoDB connection URI
const client = new MongoClient(uri);
const dbName = 'yourDatabaseName'; // Replace with your database name
let db;

const connectDB = async () => {
    if (!db) {
        await client.connect();
        db = client.db(dbName);
    }
};

// Interface for Book
export interface Book {
    name: string;
    author: string;
    description: string;
    price: number;
    image: string;
}

// Function to list all books
export const listBooks = async () => {
    await connectDB();
    const books = await db.collection('books').find().toArray();
    return books.map(book => ({ ...book, id: book._id.toString() })); // Convert ObjectId to string
};

// Function to add a book
export const addBook = async (book: Book) => {
    await connectDB();
    const result = await db.collection('books').insertOne(book);
    
    if (result.insertedCount === 0) {
        throw new Error('Failed to add book');
    }

    return { ...book, id: result.insertedId.toString() }; // Return the inserted book
};

// Function to update a book
export const updateBook = async (id: string, updatedBook: Partial<Book>) => {
    await connectDB();
    const objectId = new ObjectId(id);
    const updateResult = await db.collection('books').updateOne(
        { _id: objectId },
        { $set: updatedBook }
    );

    if (updateResult.modifiedCount === 0) {
        throw new Error('No changes made or book not found');
    }

    return { ...updatedBook, id }; // Return the updated book
};

// Function to remove a book
export const removeBook = async (id: string) => {
    await connectDB();
    const result = await db.collection('books').deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0; // Return true if deleted
};
