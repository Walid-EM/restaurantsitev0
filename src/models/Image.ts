import mongoose from 'mongoose';

export interface IImage extends mongoose.Document {
  filename: string;
  originalName: string;
  contentType: string;
  filePath: string;        // Chemin vers le fichier sur le disque
  size: number;
  uploadedAt: Date;
}

const imageSchema = new mongoose.Schema<IImage>({
  filename: {
    type: String,
    required: [true, 'Le nom de fichier est requis'],
    unique: true,
  },
  originalName: {
    type: String,
    required: [true, 'Le nom original est requis'],
  },
  contentType: {
    type: String,
    required: [true, 'Le type de contenu est requis'],
  },
  filePath: {
    type: String,
    required: [true, 'Le chemin du fichier est requis'],
  },
  size: {
    type: Number,
    required: [true, 'La taille du fichier est requise'],
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Image || mongoose.model<IImage>('Image', imageSchema);
