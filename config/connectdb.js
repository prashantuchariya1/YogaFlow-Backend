import mongoose from 'mongoose';

const connectDb = async (DATABASE_URL) =>{
    console.log('Attempting to connect to database...');
    
    try{
        const DB_OPTIONS = {
            dbName: "yoga"
        }
        await mongoose.connect(DATABASE_URL, DB_OPTIONS)
        console.log('Connected to database successfully');
    } catch(error) {
        console.error('Failed to connect to the database:', error);
    }
};

export default connectDb;