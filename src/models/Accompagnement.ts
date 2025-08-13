import mongoose from 'mongoose';

export interface IAccompagnement extends mongoose.Document {
  name: string;
  price: number;
  image: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const accompagnementSchema = new mongoose.Schema<IAccompagnement>({
  name: {
    type: String,
    required: [true, 'Le nom est requis'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Le prix est requis'],
    min: [0, ' prix ne peut pas être négatif'],
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

export default mongoose.models.Accompagnement || mongoose.model<IAccompagnement>('Accompagnement', accompagnementSchema);
