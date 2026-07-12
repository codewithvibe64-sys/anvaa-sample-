import mongoose from 'mongoose';

const HistorySchema = new mongoose.Schema({
  year: { type: String, required: true },
  event: { type: String, required: true }
});

const DesignerSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  city: { type: String, required: true },
  specialty: { type: String, required: true },
  avatar: { type: String, default: "" },
  coverImage: { type: String, default: "" },
  bio: { type: String, default: "" },
  achievements: [{ type: String }],
  history: [HistorySchema],
  portfolio: [{ type: String }],
  rating: { type: Number, default: 5.0 },
  reviewsCount: { type: Number, default: 0 },
  consultationFee: { type: Number, default: 3000 },
  createdAt: { type: Date, default: Date.now }
});

export const Designer = mongoose.model('Designer', DesignerSchema);
