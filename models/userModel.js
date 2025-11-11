import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";


const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, default: "" }, // optional phone number
  avatar: { type: String, default: "" }, // can store image URL or file path
}, { timestamps: true });

userSchema.plugin(mongoosePaginate);

const User = mongoose.model("User", userSchema);
export default User;
