import { ObjectId } from 'mongodb';
import { db } from './bookStore'; // Ensure this imports your MongoDB connection

export type BookID = string;

export interface Book {
    id?: BookID;
    name: string;
    author: string;
    description: string;
    price: number;
    image: string;
}

// List books with optional filters
async function listBooks(filters?: Array<{ from?: number; to?: number }>): Promise<Book[]> {
    const query: any = {};

    // Apply filters if present
    if (filters && filters.length) {
        if (filters[0].from) {
            query.price = { $gte: filters[0].from };
        }
        if (filters[0].to) {
            query.price = { ...query.price, $lte: filters[0].to };
        }
    }

    const books = await db.collection('books').find(query).toArray();
    return books.map(book => ({ ...book, id: book._id.toString() })); // Convert ObjectId to string
}

// Create or update a book
async function createOrUpdateBook(book: Book): Promise<BookID> {
    const existingBook = await db.collection('books').findOne({ name: book.name, author: book.author });

    if (existingBook) {
        // Update existing book
        await db.collection('books').updateOne(
            { _id: new ObjectId(existingBook._id) },
            { $set: book }
        );
        return existingBook._id.toString(); // Return the ID of the updated book
    } else {
        // Create new book
        const result = await db.collection('books').insertOne(book);
        return result.insertedId.toString(); // Return the ID of the new book
    }
}

// Remove a book
async function removeBook(bookId: BookID): Promise<void> {
    const result = await db.collection('books').deleteOne({ _id: new ObjectId(bookId) });
    if (result.deletedCount === 0) {
        throw new Error("Book not found");
    }
}

const assignment = "assignment-2";

export default {
    assignment,
    createOrUpdateBook,
    removeBook,
    listBooks,
};
