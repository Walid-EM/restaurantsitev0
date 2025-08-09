"use client";
import Image from "next/image";
import Link from "next/link";

import { useState, useEffect } from "react";

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


  const [activePage, setActivePage] = useState('home');

  const toggleMobileMenu = () => {
    console.log('Toggle mobile menu clicked');
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };









  // Gestion du clavier pour fermer le menu mobile
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);





  return (
    <div className="min-h-screen bg-gray-50 overflow-hidden">
      {/* Header avec navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-md border-b border-white/10 text-white shadow-lg">
        <div className="max-w-[95vw] mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Zone gauche: hamburger (mobile) + logo + titre */}
            <div className="flex items-center gap-3">
              <button 
                onClick={toggleMobileMenu}
                className="xl:hidden text-white p-2 rounded-md hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white/30"
                aria-label="Menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <button 
                onClick={() => setActivePage('home')}
                className="flex items-center gap-3 focus:outline-none"
              >
                <span className="inline-block font-semibold tracking-wide text-white/90 text-sm sm:text-lg">Delice Wang</span>
              </button>
            </div>

            {/* Zone droite: nav + Commander */}
            <div className="flex items-center gap-6 ml-auto">
              <nav className="hidden xl:flex items-center gap-8">
                <button 
                  onClick={() => setActivePage('restaurant')}
                  className={`uppercase tracking-wide text-sm font-medium pb-1 border-b-2 transition-colors focus:outline-none ${
                    activePage === 'restaurant' ? 'text-yellow-400 border-yellow-400' : 'text-white/70 border-transparent hover:text-white hover:border-white/40'
                  }`}
                >
                  Notre Restaurant
                </button>
                <button 
                  onClick={() => setActivePage('carte')}
                  className={`uppercase tracking-wide text-sm font-medium pb-1 border-b-2 transition-colors focus:outline-none ${
                    activePage === 'carte' ? 'text-yellow-400 border-yellow-400' : 'text-white/70 border-transparent hover:text-white hover:border-white/40'
                  }`}
                >
                  La Carte
                </button>
                <button 
                  onClick={() => setActivePage('rejoindre')}
                  className={`uppercase tracking-wide text-sm font-medium pb-1 border-b-2 transition-colors focus:outline-none mr-15 ${
                    activePage === 'rejoindre' ? 'text-yellow-400 border-yellow-400' : 'text-white/70 border-transparent hover:text-white hover:border-white/40 mr-15'
                  }`}
                >
                  Nous Rejoindre
                </button>
              </nav>

              <Link href="/Commande">
                <button 
                  className="hidden xl:inline-flex font-display tracking-wide bg-white/95 text-black font-semibold py-3.5 px-9 rounded-xl shadow-[0_6px_20px_rgba(255,215,0,0.25)] hover:bg-white hover:shadow-[0_8px_24px_rgba(255,215,0,0.35)] focus:outline-none focus:ring-2 focus:ring-yellow-300 transition-all"
                >
                  COMMANDER
                </button>
              </Link>

              <Link href="/Commande">
                <button 
                  className="xl:hidden font-display tracking-wide bg-white/95 text-black font-semibold py-2.5 px-5 rounded-xl shadow-[0_6px_20px_rgba(255,215,0,0.25)] hover:bg-white hover:shadow-[0_8px_24px_rgba(255,215,0,0.35)] transition-all focus:outline-none focus:ring-2 focus:ring-yellow-300 text-sm"
                >
                  COMMANDER
                </button>
              </Link>
            </div>
          </div>

          {/* Menu mobile */}
          <div className={`xl:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
            <div className="px-3 py-3 space-y-1 bg-black/80 backdrop-blur-md border-t border-white/10 shadow-lg">
              <button 
                onClick={() => {setActivePage('restaurant'); setIsMobileMenuOpen(false);}}
                className={`block w-full text-left px-3 py-2 rounded-md transition-colors duration-200 uppercase tracking-wide text-sm font-medium focus:outline-none ${
                  activePage === 'restaurant' ? 'text-white bg-white/10' : 'text-white/80 hover:text-white hover:bg-white/5'
                }`}
              >
                Notre Restaurant
              </button>
              <button 
                onClick={() => {setActivePage('carte'); setIsMobileMenuOpen(false);}}
                className={`block w-full text-left px-3 py-2 rounded-md transition-colors duration-200 uppercase tracking-wide text-sm font-medium focus:outline-none ${
                  activePage === 'carte' ? 'text-white bg-white/10' : 'text-white/80 hover:text-white hover:bg-white/5'
                }`}
              >
                La Carte
              </button>
              <button 
                onClick={() => {setActivePage('rejoindre'); setIsMobileMenuOpen(false);}}
                className={`block w-full text-left px-3 py-2 rounded-md transition-colors duration-200 uppercase tracking-wide text-sm font-medium focus:outline-none ${
                  activePage === 'rejoindre' ? 'text-white bg-white/10' : 'text-white/80 hover:text-white hover:bg-white/5'
                }`}
              >
                Nous Rejoindre
              </button>
              <Link href="/Commande">
                <button 
                  className="w-full mt-4 bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 text-black font-semibold py-3 px-6 rounded-full shadow-md hover:from-yellow-200 hover:via-yellow-300 hover:to-yellow-400 transition-colors font-handwriting focus:outline-none focus:ring-2 focus:ring-yellow-300"
                >
                  COMMANDER
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Arrière-plan fixe sur tout l'écran */}
      <div className="fixed inset-0 w-full h-full">
        {/* Vidéo en arrière-plan (z-index le plus bas) */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src="/burger0.mp4" type="video/mp4" />
          Votre navigateur ne supporte pas la lecture de vidéos.
        </video> 
        
         {/* Image d'arrière-plan principale */}
        {/* <div className="absolute inset-0 z-10 overflow-hidden">
          <div 
            className="absolute w-full h-full"
            style={{
              backgroundImage: 'url(/BGTEST.png)',
              backgroundSize: 'auto',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              transform: 'scale(1.5) scaleX(-3) translateY(-200px) translateX(40px)',
              transformOrigin: 'center center',
              width: '100vw',
              height: '100vh',
              minWidth: '1920px',
              minHeight: '1080px'
            }}
          />
        </div> */} 
        
        {/* Overlay sombre pour améliorer la lisibilité */}
        <div className={`absolute inset-0 bg-black/30 bg-opacity-40 z-20 transition-all duration-300 ${
          activePage !== 'home' ? 'backdrop-blur-md' : ''
        }`}></div>
      </div>

      {/* Contenu principal qui prend tout l'écran */}
      <div className="relative z-30 min-h-screen md:h-screen overflow-y-auto md:overflow-hidden flex flex-col">
        {/* Espace pour le header */}
        <div className="h-20 flex-shrink-0"></div>
        {activePage === 'home' && (
          <div className="flex-1 flex items-center justify-center sm:justify-start">
                              <div className="w-full max-w-6xl ml-[5vw] pr-6 text-center sm:text-left text-white">
                    <h1 className="text-4xl sm:text-6xl xl:text-7xl font-extrabold tracking-tight drop-shadow-2xl">
                      Bienvenue chez Delice Wang
                    </h1>
                    <p className="mt-2 text-base sm:text-lg xl:text-xl text-white/90 max-w-2xl mb-15">
                      Savourez nos spécialités maison, préparées avec des ingrédients frais, pour des moments gourmands et conviviaux.
                    </p>

                    <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mb-15">
                                        <div className="rounded-xl bg-black/50 backdrop-blur-md border border-white/10 p-6">
                      <div className="text-sm text-white/60">Téléphone</div>
                      <div className="mt-2 text-lg font-semibold">02 468 12 76</div>
                    </div>
                                        <div className="rounded-xl bg-black/50 backdrop-blur-md border border-white/10 p-6">
                      <div className="text-sm text-white/60">Réseaux</div>
                      <div className="mt-2 space-x-2 text-lg font-semibold">
                        <a href="#" className="hover:underline">Instagram</a>
                        <span className="text-white/40">•</span>
                        <a href="#" className="hover:underline">Facebook</a>
                      </div>
                    </div>
                                        <div className="rounded-xl bg-black/50 backdrop-blur-md border border-white/10 p-6">
                      <div className="text-sm text-white/60">Localisation</div>
                      <div className="mt-2 text-lg font-semibold">Rue de Wand 64, 1020 Laeken</div>
                    </div>
                  </div>

                <div className="mt-14">
                  <Link href="/Commande">
                    <button className="font-display tracking-wide bg-white/95 text-black font-semibold py-3.5 px-9 rounded-xl shadow-[0_6px_20px_rgba(255,215,0,0.25)] hover:bg-white hover:shadow-[0_8px_24px_rgba(255,215,0,0.35)] focus:outline-none focus:ring-2 focus:ring-yellow-300 transition-all">
                      Commander maintenant
                    </button>
                  </Link>
                </div>
            </div>
          </div>
        )}
        
        {activePage === 'restaurant' && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center h-[95%] w-full md:w-[60%] p-8 bg-black/95 rounded-lg shadow-2xl flex flex-col">
              <h2 className="text-4xl font-bold text-white mb-8">Notre Restaurant</h2>
              <p className="text-lg text-white max-w-2xl mx-auto mt-[30vh]">
                Découvrez notre histoire, nos valeurs et notre passion pour la cuisine de qualité.
              </p>
            </div>
          </div>
        )}
        
        {activePage === 'carte' && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center h-[95%] w-full md:w-[60%] p-8 bg-black/95 rounded-lg shadow-2xl flex flex-col">
              <h2 className="text-4xl font-bold text-white mb-8">LA CARTE</h2>
              <p className="text-lg text-white max-w-2xl mx-auto mt-[30vh]">
                Explorez notre menu avec nos délicieux burgers, accompagnements et boissons.
              </p>
            </div>
          </div>
        )}
        
        {/* Section localisation supprimée, les infos clés sont directement sur l'accueil */}
        
        {activePage === 'rejoindre' && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center h-[95%] w-full md:w-[60%] p-8 bg-black/95 rounded-lg shadow-2xl flex flex-col">
              <h2 className="text-4xl font-bold text-white mb-8">Nous Rejoindre</h2>
              <p className="text-lg text-white max-w-2xl mx-auto mt-[30vh]">
                Rejoignez notre équipe et participez à l&apos;aventure Delice Wand.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
