import mongoose from 'mongoose';

export interface ISupplement extends mongoose.Document {
  name: string;
  price: number;
  image: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const supplementSchema = new mongoose.Schema<ISupplement>({
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

export default mongoose.models.Supplement || mongoose.model<ISupplement>('Supplement', supplementSchema);
