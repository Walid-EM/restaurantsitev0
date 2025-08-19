import mongoose from 'mongoose';

export interface ICategory extends mongoose.Document {
  name: string;
  description: string;
  image: string;
  isActive: boolean;
  // Options configurables pour cette catégorie
  allowedOptions: string[];
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new mongoose.Schema<ICategory>({
  name: {
    type: String,
    required: [true, 'Le nom est requis'],
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'La description est requise'],
    trim: true,
  },
  image: {
    type: String,
    required: [true, 'L\'image est requise'],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  allowedOptions: {
    type: [String],
    default: [],
    enum: ['supplements', 'sauces', 'extras', 'accompagnements', 'boissons'],
  },
  order: {
    type: Number,
    default: 0,
    min: 0,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Category || mongoose.model<ICategory>('Category', categorySchema);
