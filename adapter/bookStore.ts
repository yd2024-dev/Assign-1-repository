import fs from 'fs';
import path from 'path';

export interface Book {
    name: string;
    author: string;
    description: string;
    price: number;
    image: string;
}

const booksFilePath = path.join(__dirname, '../mcmasteful-book-list.json');

// Function to read books from the JSON file
const getBooks = (): Promise<Book[]> => {
    return new Promise((resolve, reject) => {
        fs.readFile(booksFilePath, 'utf8', (err, data) => {
            if (err) {
                return reject(err);
            }
            const books: Book[] = JSON.parse(data);
            resolve(books);
        });
    });
};

// Function to list books
export const listBooks = async (): Promise<Book[]> => {
    return await getBooks(); // Return all books
};

// You can add more functions for addBook, updateBook, removeBook as needed
