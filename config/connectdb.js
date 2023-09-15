import mongoose from 'mongoose'

const connectDb = async (DATABASE_URL) =>{
    try{
        const DB_OPTIONS = {
            dbName: "yoga"
        }
        await mongoose.connect(DATABASE_URL, DB_OPTIONS)
        console.log('connected successfully....')
    } catch(error) {
        console.log(error)
    }
}

export default connectDb