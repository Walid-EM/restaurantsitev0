import mongoose from 'mongoose';

export interface IProduct extends mongoose.Document {
  name: string;
  description: string;
  price: number;
  category: string; // Changé de ObjectId à string
  image: string;
  isAvailable: boolean;
  extras: mongoose.Types.ObjectId[];
  
  // Nouvelles propriétés inspirées de Bicky
  ingredients?: string[];
  isSpicy?: boolean;
  isVegetarian?: boolean;
  
  // Métadonnées extensibles pour futures extensions
  metadata?: Record<string, unknown>;
  
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new mongoose.Schema<IProduct>({
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
    type: String, // Changé de ObjectId à String
    required: [true, 'La catégorie est requise'],
    trim: true,
  },
  image: {
    type: String,
    required: [true, 'L\'image est requise'],
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  extras: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Extra',
  }],
  
  // Nouvelles propriétés inspirées de Bicky
  ingredients: [{
    type: String,
    trim: true,
  }],
  isSpicy: {
    type: Boolean,
    default: false,
  },
  isVegetarian: {
    type: Boolean,
    default: false,
  },
  
  // Métadonnées extensibles
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
}, {
  timestamps: true,
});

export default mongoose.models.Product || mongoose.model<IProduct>('Product', productSchema);
