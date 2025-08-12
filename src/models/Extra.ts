import mongoose from 'mongoose';

export interface IExtra extends mongoose.Document {
  name: string;
  description: string;
  price: number;
  category: string;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const extraSchema = new mongoose.Schema<IExtra>({
  name: {
    type: String,
    required: [true, 'Le nom est requis'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'La description est requise'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Le prix est requis'],
    min: [0, 'Le prix ne peut pas être négatif'],
  },
  category: {
    type: String,
    required: [true, 'La catégorie est requise'],
    enum: ['supplement', 'sauce', 'boisson', 'accompagnement'],
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Extra || mongoose.model<IExtra>('Extra', extraSchema);
