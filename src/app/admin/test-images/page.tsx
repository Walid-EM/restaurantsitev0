import AdminImageSync from '@/components/ui/AdminImageSync';
import AdminImageUpload from '@/components/ui/AdminImageUpload';
import AdminImageDisplay from '@/components/ui/AdminImageDisplay';
import AdminNavigation from '@/components/ui/AdminNavigation';
import { useState } from 'react';

export default function AdminTestImagesPage() {
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
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            🧪 Test du Système d'Images
          </h1>
          <p className="text-xl text-gray-600">
            Testez l'upload, la synchronisation et l'affichage des images Cloudinary
          </p>
        </div>

        {/* Instructions de test */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-blue-800 mb-3">📋 Instructions de Test</h2>
          <ol className="list-decimal list-inside space-y-2 text-blue-700">
            <li><strong>Upload d'image</strong> : Utilisez le composant ci-dessous pour uploader une image</li>
            <li><strong>Synchronisation</strong> : Cliquez sur "🔄 Synchroniser et Rebuilder" pour synchroniser avec Cloudinary</li>
            <li><strong>Vérification</strong> : Vérifiez que l'image apparaît dans la liste des images</li>
            <li><strong>Affichage</strong> : Testez l'affichage avec MongoImage</li>
          </ol>
        </div>

        {/* Composant de synchronisation */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">🔄 Synchronisation Cloudinary</h2>
          <AdminImageSync />
        </div>
        
        {/* Composant d'upload */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">📤 Upload d'Images</h2>
          <AdminImageUpload 
            currentImage={selectedImage?.filePath}
            currentImageId={selectedImage?.imageId}
            onImageChange={handleImageChange}
            label="Image de test"
          />
        </div>

        {/* Composant d'affichage */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">🖼️ Affichage des Images</h2>
          <AdminImageDisplay />
        </div>

        {/* Informations de test */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">ℹ️ Informations de Test</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <h3 className="font-medium text-gray-700 mb-2">✅ Tests à effectuer :</h3>
              <ul className="space-y-1">
                <li>• Upload d'une nouvelle image</li>
                <li>• Synchronisation avec Cloudinary</li>
                <li>• Affichage dans la liste</li>
                <li>• Sélection d'une image existante</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-700 mb-2">🔍 Points de vérification :</h3>
              <ul className="space-y-1">
                <li>• Image visible dans MongoDB</li>
                <li>• Image synchronisée localement</li>
                <li>• Affichage correct avec MongoImage</li>
                <li>• Pas d'erreurs dans la console</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Retour au dashboard */}
        <div className="text-center">
          <a
            href="/admin"
            className="inline-flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            ← Retour au Dashboard
          </a>
        </div>
      </div>
    </>
  );
}
