import Koa from 'koa';
import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';
import { listBooks } from '../adapter/assignment-1'; // Ensure this path is correct

const app = new Koa();
const router = new Router();

// Handle root route
//router.get('/', async (ctx) => {
  //  ctx.status = 404; // Set status to 404
   // ctx.body = { message: 'Not Found' }; // Response body
router.get('/', (ctx) => {
    ctx.body = { message: 'Welcome to the McMasterful Books API!' };
});


// Middleware
app.use(bodyParser());


// Route to get all books
router.get('/api/books', async (ctx) => {
    const { from, to } = ctx.query;
    const fromPrice = from ? Number(from) : undefined;
    const toPrice = to ? Number(to) : undefined;

    try {
        const books = await listBooks(fromPrice, toPrice);
        ctx.body = { success: true, data: books };
    } catch (error) {
        ctx.status = 500;
        ctx.body = { success: false, message: 'Error fetching books' };
    }
});

// Apply routes
app.use(router.routes());
app.use(router.allowedMethods());

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
