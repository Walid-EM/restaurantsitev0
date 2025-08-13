import mongoose from 'mongoose';

export interface ISauce extends mongoose.Document {
  name: string;
  price: number;
  image: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const sauceSchema = new mongoose.Schema<ISauce>({
  name: {
    type: String,
    required: [true, 'Le nom est requis'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Le prix est requis'],
    min: [0, 'Le prix ne peut pas être négatif'],
  },
  image: {
    type: String,
    required: [true, 'L\'image est requise'],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Sauce || mongoose.model<ISauce>('Sauce', sauceSchema);
