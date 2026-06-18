import mongoose from 'mongoose';

const AddressSchema = new mongoose.Schema({
  id: { type: String, default: () => "addr_" + Date.now() },
  name: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  phone: { type: String, required: true }
});

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String, default: "" },
  avatar: { type: String, default: "" },
  role: { type: String, default: "customer" },
  savedAddresses: [AddressSchema],
  wishlist: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.model('User', UserSchema);
