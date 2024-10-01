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
            try {
                const books: Book[] = JSON.parse(data);
                resolve(books);
            } catch (parseError) {
                reject(new Error('Error parsing JSON data'));
            }
        });
    });
};

// Function to validate price input
const validatePrice = (price?: number): void => {
    if (price !== undefined && typeof price !== 'number') {
        throw new Error('Price must be a number');
    }
};

// Function to list books with optional price filters
export const listBooks = async (fromPrice?: number, toPrice?: number): Promise<Book[]> => {
    const books = await getBooks();

    // Validate price inputs
    validatePrice(fromPrice);
    validatePrice(toPrice);

    // Filter books based on price range if provided
    return books.filter(book => {
        const withinFromPrice = fromPrice !== undefined ? book.price >= fromPrice : true;
        const withinToPrice = toPrice !== undefined ? book.price <= toPrice : true;
        return withinFromPrice && withinToPrice;
    });
};
