import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import router from '../adapter/index'; // Adjust the path as necessary

const app = new Koa();
const PORT = process.env.PORT || 3000;

app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

