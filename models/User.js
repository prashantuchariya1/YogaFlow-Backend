import mongoose from "mongoose";

// Defining Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  password: { type: String, required: true, trim: true },
  tc: { type: Boolean, required: true },
  address: { type: String, required: false, trim: true },
  dob: { type: String, required: false, trim: true },
  gender: { type: String, required: false, trim: true },
  facebook: { type: String, required: false, trim: true },
  twitter: { type: String, required: false, trim: true },
  instagram: { type: String, required: false, trim: true }
})

// Model
const UserModel = mongoose.model("user", userSchema)
//table with name user will be craeted

export default UserModel