'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function ClientBHome() {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    console.log("Component monté, isLoaded défini à true");
    setIsLoaded(true);
  }, []);

  const handleCommanderClick = () => {
    console.log("=== DÉBUT DEBUG BOUTON ===");
    console.log("Bouton cliqué !");
    console.log("Router disponible:", !!router);
    console.log("Tentative de navigation vers /ClientB/PageCommand");
    
    try {
      router.push('/Borne/PageCommand');
      console.log("Navigation déclenchée avec succès");
    } catch (error) {
      console.error("Erreur lors de la navigation:", error);
    }
    
    console.log("=== FIN DEBUG BOUTON ===");
  };

  console.log("Rendu du composant, isLoaded:", isLoaded);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src="/burger0.mp4" type="video/mp4" />
        Votre navigateur ne supporte pas la lecture de vidéos.
      </video>

      {/* Overlay sombre pour améliorer la lisibilité */}
      <div className="absolute inset-0 pointer-events-none" />

      {/* Contenu principal */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center">
        <h1 className={`mb-4 text-4xl md:text-6xl font-bold text-white text-center transition-opacity duration-1000 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}>
          Bienvenue chez Shigiburger
        </h1>
        
        <p className={`mb-8 text-xl md:text-2xl text-white text-center max-w-2xl px-4 transition-opacity duration-1000 delay-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}>
          Découvrez nos délicieux burgers et bien plus encore
        </p>
      </div>

      {/* Bouton Commander positionné en bas */}  
      <div className={`absolute bottom-35 left-0 right-0 flex justify-center transition-opacity duration-800 delay-500 ${
        isLoaded ? 'opacity-100' : 'opacity-0'
      }`}>
        <button 
          onClick={handleCommanderClick}
          className="px-12 py-6 bg-orange-500 focus:bg-orange-600 text-white font-bold text-2xl rounded-full transform transition-all duration-300 focus:scale-110 shadow-lg focus:shadow-xl"
          style={{ zIndex: 20 }}
        >
          Commander
        </button>
      </div>
    </div>
  );
}