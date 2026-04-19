import mongoose, { Document, Schema } from 'mongoose';

export interface OrderDocument extends Document<string> {
  _id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  fullAddress: string;
  region: string;
  location: {
    lat: number;
    lng: number;
  };
  status: string;
  captainId: string | null;
  externalReference: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<OrderDocument>(
  {
    _id: { type: String, required: true },
    orderNumber: { type: String, required: true, unique: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    fullAddress: { type: String, required: true },
    region: { type: String, required: true },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    status: {
      type: String,
      required: true,
      enum: ['created', 'assigned', 'picked_up', 'delivered', 'cancelled'],
    },
    captainId: { type: String, default: null },
    externalReference: { type: String, default: null },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
  },
  {
    _id: false,
    timestamps: false,
    versionKey: false,
  },
);

orderSchema.index({ status: 1 });
orderSchema.index({ region: 1 });
orderSchema.index({ captainId: 1 });
orderSchema.index({ createdAt: 1 });
orderSchema.index({ updatedAt: 1 });
orderSchema.index(
  { orderNumber: 'text', customerName: 'text', customerPhone: 'text' },
  { weights: { orderNumber: 3, customerName: 2, customerPhone: 1 }, name: 'order_text_search' },
);

export const OrderModel = mongoose.model<OrderDocument>('Order', orderSchema);
