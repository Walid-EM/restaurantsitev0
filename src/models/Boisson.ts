import mongoose from 'mongoose';

export interface IBoisson extends mongoose.Document {
  name: string;
  price: number;
  image: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const boissonSchema = new mongoose.Schema<IBoisson>({
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

export default mongoose.models.Boisson || mongoose.model<IBoisson>('Boisson', boissonSchema);
