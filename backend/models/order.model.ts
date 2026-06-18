import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema({
  product: {
    id: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String },
    images: [{ type: String }]
  },
  quantity: { type: Number, required: true },
  size: { type: String, default: 'M' }
});

const TrackingTimelineSchema = new mongoose.Schema({
  status: { type: String, required: true },
  date: { type: String, required: true },
  description: { type: String, default: "" },
  done: { type: Boolean, default: false }
});

const OrderSchema = new mongoose.Schema({
  id: { type: String, required: true },
  userId: { type: String, required: true },
  items: [OrderItemSchema],
  subtotal: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  shipping: { type: Number, default: 0 },
  total: { type: Number, required: true },
  address: {
    name: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    phone: { type: String, required: true }
  },
  status: { type: String, default: "Order Placed" },
  trackingTimeline: [TrackingTimelineSchema],
  createdAt: { type: Date, default: Date.now }
});

export const Order = mongoose.model('Order', OrderSchema);
