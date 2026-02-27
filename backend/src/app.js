// The actual Express app
import Express, { urlencoded } from 'express';
// Importing the cors (cross-origin resource sharing) package
import cors from 'cors';
// Importing cookie parser to manage cookies to CURD.
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'

dotenv.config()

// initializing the express app
const app = Express();

// For parsing application/json
app.use(Express.json({limit: "30mb"}));
// For ensuring that the server can accept requests from other domains
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
//For ensuring taking request from encoded url also.
app.use(urlencoded({extended:true, limit: "30mb"}));
//Cookie parser
app.use(cookieParser())
// For serving static files like images, CSS files, and JavaScript files
app.use(Express.static('public'));

// Importing the routes
import userRoute from './routes/user.route.js'
import movieRoute from './routes/movie.route.js'
import watchList from './routes/watchlist.route.js'

// Declaring routes
app.use('/api/v1/users', userRoute)
app.use('/api/v1/movie', movieRoute)
app.use('/api/v1/watchlist',watchList)



// Handling routes
app.get("/", (req, res) => {
    res.send("Server is Running");
});


export default app;