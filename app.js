import dotenv from 'dotenv'
dotenv.config()
import  express  from 'express'
import cors from 'cors';
import connectDB from './config/connectdb.js'
import userRoutes from './routes/userRoutes.js'

const app = express();
const port = process.env.PORT
const DATABASE_URL = process.env.DATABASE_URL

//CORS Policy
app.use(cors())

//JSON Middleware
app.use(express.json())

//Database Connection
connectDB(DATABASE_URL).then(() => {
    console.log("Database connected successfully.");
}).catch((err) => {
    console.log("Database connection failed:", err);
    process.exit(1); // Exit if database connection fails
});


//Load Routes
app.use("/api/user", userRoutes)

app.listen(port, ()=>{
    console.log(`server listening at http://localhost:${port}`)
})
