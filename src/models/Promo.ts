import mongoose from 'mongoose';

export interface IPromo extends mongoose.Document {
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minimumOrder: number;
  maxUses: number;
  currentUses: number;
  validFrom: Date;
  validUntil: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const promoSchema = new mongoose.Schema<IPromo>({
  code: {
    type: String,
    required: [true, 'Le code est requis'],
    unique: true,
    uppercase: true,
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'La description est requise'],
    trim: true,
  },
  discountType: {
    type: String,
    required: [true, 'Le type de réduction est requis'],
    enum: ['percentage', 'fixed'],
  },
  discountValue: {
    type: Number,
    required: [true, 'La valeur de réduction est requise'],
    min: [0, 'La réduction ne peut pas être négative'],
  },
  minimumOrder: {
    type: Number,
    required: [true, 'Le montant minimum de commande est requis'],
    min: [0, 'Le montant minimum ne peut pas être négatif'],
  },
  maxUses: {
    type: Number,
    required: [true, 'Le nombre maximum d\'utilisations est requis'],
    min: [1, 'Le nombre maximum d\'utilisations doit être au moins 1'],
  },
  currentUses: {
    type: Number,
    default: 0,
    min: [0, 'Le nombre d\'utilisations actuelles ne peut pas être négatif'],
  },
  validFrom: {
    type: Date,
    required: [true, 'La date de début de validité est requise'],
  },
  validUntil: {
    type: Date,
    required: [true, 'La date de fin de validité est requise'],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Promo || mongoose.model<IPromo>('Promo', promoSchema);
