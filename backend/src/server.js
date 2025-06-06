// Importing the express app
import app  from './app.js';
// Importing the database connection
import connectDB from './db/db.connection.js';
// For dotenv
import dotenv from 'dotenv';
// For redis db
import { client } from './db/redis.db.js';

dotenv.config({
    path: "./.env"
}
);

// Defining the port on which the server will run : means the request will be sent to this port
const PORT = process.env.PORT || 3000;

// Now making the server listen to the port
app.listen(PORT, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
});

// Establishing the connection to the database
connectDB();

// Operating redis


