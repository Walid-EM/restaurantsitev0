import AdminImageSync from '@/components/ui/AdminImageSync';
import AdminImageUpload from '@/components/ui/AdminImageUpload';
import AdminImageDisplay from '@/components/ui/AdminImageDisplay';
import AdminNavigation from '@/components/ui/AdminNavigation';
import { useState } from 'react';

export default function AdminImagesPage() {
  const [selectedImage, setSelectedImage] = useState<{
    imageId: string;
    filePath: string;
    originalName: string;
  } | null>(null);

  const handleImageChange = (imageData: { imageId: string; filePath: string; originalName: string }) => {
    setSelectedImage(imageData);
  };

  return (
    <>
      <AdminNavigation />
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Gestion des Images
        </h1>
      
      {/* Composant de synchronisation */}
      <AdminImageSync />
      
      {/* Composants existants */}
      <AdminImageUpload 
        currentImage={selectedImage?.filePath}
        currentImageId={selectedImage?.imageId}
        onImageChange={handleImageChange}
        label="Image sélectionnée"
      />
      <AdminImageDisplay />
      </div>
    </>
  );
}
