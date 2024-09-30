import Router from '@koa/router';
import { listBooks, addBook, updateBook, removeBook } from './bookStore'; // Adjust the path as necessary
import { ObjectId } from 'mongodb';

const router = new Router();

// Middleware for error handling
const handleError = (fn) => async (ctx) => {
    try {
        await fn(ctx);
    } catch (error) {
        ctx.status = 500;
        ctx.body = { message: error.message };
    }
};

// Validate ObjectId format
const isValidObjectId = (id) => ObjectId.isValid(id);

// Route to get all books
router.get('/api/books', handleError(async (ctx) => {
    const books = await listBooks();
    ctx.body = { success: true, data: books };
}));

// Route to add a book
router.post('/api/books', handleError(async (ctx) => {
    const bookData = ctx.request.body;

    // Basic validation
    if (!bookData.name || !bookData.author || !bookData.price || !bookData.image) {
        ctx.status = 400; // Bad Request
        ctx.body = { message: 'Name, author, price, and image are required.' };
        return;
    }

    const newBook = await addBook(bookData);
    ctx.status = 201; // Created
    ctx.body = { success: true, data: newBook };
}));

// Route to update a book
router.put('/api/books/:id', handleError(async (ctx) => {
    const id = ctx.params.id;

    // Validate ObjectId
    if (!isValidObjectId(id)) {
        ctx.status = 400; // Bad Request
        ctx.body = { message: 'Invalid book ID.' };
        return;
    }

    const updatedBook = await updateBook(id, ctx.request.body);
    ctx.body = { success: true, data: updatedBook };
}));

// Route to delete a book
router.delete('/api/books/:id', handleError(async (ctx) => {
    const id = ctx.params.id;

    // Validate ObjectId
    if (!isValidObjectId(id)) {
        ctx.status = 400; // Bad Request
        ctx.body = { message: 'Invalid book ID.' };
        return;
    }

    const deleted = await removeBook(id);
    if (!deleted) {
        ctx.status = 404; // Not Found
        ctx.body = { message: 'Book not found.' };
        return;
    }

    ctx.status = 204; // No Content
}));

// Export the router
export default router;
