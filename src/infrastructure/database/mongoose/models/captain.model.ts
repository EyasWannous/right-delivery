import mongoose, { Document, Schema } from 'mongoose';

export interface CaptainDocument extends Document<string> {
  _id: string;
  name: string;
  phone: string;
  vehicleType: string;
  status: string;
  availability: string;
  currentLocation?: {
    lat: number;
    lng: number;
    updatedAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const captainSchema = new Schema<CaptainDocument>(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    vehicleType: { type: String, required: true },
    status: {
      type: String,
      required: true,
      enum: ['active', 'inactive'],
      default: 'inactive',
    },
    availability: {
      type: String,
      required: true,
      enum: ['online', 'offline'],
      default: 'offline',
    },
    currentLocation: {
      lat: { type: Number },
      lng: { type: Number },
      updatedAt: { type: Date },
    },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
  },
  {
    _id: false,
    timestamps: false,
    versionKey: false,
  },
);

captainSchema.index({ status: 1 });
captainSchema.index({ availability: 1 });
captainSchema.index({ status: 1, availability: 1 });

export const CaptainModel = mongoose.model<CaptainDocument>('Captain', captainSchema);
