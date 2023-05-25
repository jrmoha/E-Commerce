import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import userAuthRoute from './routes/userAuthRoute.js';
import session from 'express-session';
import favRoute from './routes/favoritesRoute.js';
import cartRoute from './routes/cartRoute.js';
import trendingRoute from './routes/trendingRoute.js';
import productsRoute from './routes/productsRoute.js';
import usersRoute from './routes/usersRoute.js';


dotenv.config();
const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: "This Is My Stupid Application",
    resave: true,
    saveUninitialized: true,
    cookie: {},
}));
app.use((err, req, res, next) => {
    res.status(500).send(err.Stack);
});

app.use('/', userAuthRoute);
app.use('/', favRoute);
app.use('/', cartRoute);
app.use('/', trendingRoute);
app.use('/', productsRoute);
app.use('/', usersRoute);

app.listen(process.env.PORT, '127.0.0.1');
