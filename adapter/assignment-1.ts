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

export async function listBooks(filters?: Array<{ from?: number; to?: number }>): Promise<Book[]> {
    const books = await getBooks();

    if (!filters || filters.length === 0) {
        return books; // No filters, return all books
    }

    return books.filter(book => {
        return filters.some(filter => {
            const from = filter.from !== undefined ? filter.from : 0;
            const to = filter.to !== undefined ? filter.to : Infinity;
            return book.price >= from && book.price <= to;
        });
    });
}
