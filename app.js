import express from 'express';
import 'dotenv/config';
import userAuthRoute from './routes/userAuthRoute.js';
import session from 'express-session';
import favRoute from './routes/favoritesRoute.js';
import cartRoute from './routes/cartRoute.js';
import trendingRoute from './routes/trendingRoute.js';
import productsRoute from './routes/productsRoute.js';
import usersRoute from './routes/usersRoute.js';


const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: {},
}));


app.use('/', userAuthRoute);
app.use('/', favRoute);
app.use('/', cartRoute);
app.use('/', trendingRoute);
app.use('/', productsRoute);
app.use('/', usersRoute);

app.use((err, _req, res, _next) => {
    res.status(500).send(err.Stack);
});

app.listen(process.env.PORT);
