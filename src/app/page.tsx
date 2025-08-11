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
    <div className="min-h-screen bg-gray-50">
      {/* Header avec navigation */}
      <header className="bg-black/60 backdrop-blur-sm border-b border-gray-600/50 text-white fixed top-0 left-0 right-0 z-50 shadow-2xl">
        <div className="flex items-center h-20 w-full px-6">

            {/* Menu hamburger - Mobile seulement, tout à gauche */}
            <button 
              onClick={toggleMobileMenu}
              className="xl:hidden text-white p-3 focus:outline-none hover:bg-white/10 rounded-xl transition-all duration-200"
              aria-label="Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Logo + Titre (centré sur mobile, à gauche sur desktop) */}
            <div className="flex-shrink-0">
              <button 
                onClick={() => setActivePage('home')}
                className="flex items-center space-x-3 focus:outline-none hover:scale-105 transition-all duration-200 group"
              >
                <div className="relative">
                  <Image
                    src="/cheeseburger.png"
                    alt="Cheeseburger Logo"
                    width={40}
                    height={40}
                    className="w-10 h-10"
                  />
                  <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                </div>
                <h1 className="text-xl xl:text-3xl font-bold text-white hover:text-yellow-400 transition-colors duration-300">
                  Delice Wand
                </h1>
              </button>
            </div>

            {/* Navigation + Bouton Commander à droite */}
            <div className="flex items-center space-x-6 xl:ml-auto">
              {/* Menu de navigation - Desktop */}
              <nav className="hidden xl:flex items-center space-x-2">
              <button 
                onClick={() => setActivePage('restaurant')}
                className={`whitespace-nowrap px-4 py-3 text-sm font-medium transition-all duration-300 relative rounded-xl hover:bg-white/5 ${
                  activePage === 'restaurant' ? 'text-white bg-white/10' : 'text-gray-300 hover:text-white'
                }`}
              >
                <span className="relative z-10">Notre Restaurant</span>
                {activePage === 'restaurant' && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-in slide-in-from-left duration-300" />
                )}
              </button>
              <button 
                onClick={() => setActivePage('carte')}
                className={`whitespace-nowrap px-4 py-3 text-sm font-medium transition-all duration-300 relative rounded-xl hover:bg-white/5 ${
                  activePage === 'carte' ? 'text-white bg-white/10' : 'text-gray-300 hover:text-white'
                }`}
              >
                <span className="relative z-10">La Carte</span>
                {activePage === 'carte' && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-in slide-in-from-left duration-300" />
                )}
              </button>
              <button 
                onClick={() => setActivePage('localisation')}
                className={`whitespace-nowrap px-4 py-3 text-sm font-medium transition-all duration-300 relative rounded-xl hover:bg-white/5 ${
                  activePage === 'localisation' ? 'text-white bg-white/10' : 'text-gray-300 hover:text-white'
                }`}
              >
                <span className="relative z-10">Où nous trouver ?</span>
                {activePage === 'localisation' && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-in slide-in-from-left duration-300" />
                )}
              </button>
              <button 
                onClick={() => setActivePage('rejoindre')}
                className={`whitespace-nowrap px-4 py-3 text-sm font-medium transition-all duration-300 relative rounded-xl hover:bg-white/5 ${
                  activePage === 'rejoindre' ? 'text-white bg-white/10' : 'text-gray-300 hover:text-white'
                }`}
              >
                <span className="relative z-10">Nous Rejoindre</span>
                {activePage === 'rejoindre' && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-in slide-in-from-left duration-300" />
                )}
              </button>
              </nav>

              {/* Bouton Commander - Desktop seulement */}
              <Link href="/Commande">
                <button className="hidden xl:block relative group bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 hover:from-yellow-500 hover:via-orange-500 hover:to-red-500 text-black font-bold py-3 xl:py-4 px-6 xl:px-10 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/50 focus:outline-none text-sm xl:text-base overflow-hidden tracking-wide"
                  style={{ fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif" }}
                >
                  <span className="relative z-10 flex items-center space-x-2">
                    <span className="font-semibold">COMMANDER</span>
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                  <div className="absolute inset-0 bg-white/20 translate-x-full group-hover:translate-x-0 transition-transform duration-500 skew-x-12"></div>
                </button>
              </Link>
            </div>
          </div>

          {/* Menu mobile */}
          <div className={`xl:hidden transition-all duration-300 ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
            <div className="px-6 pt-4 pb-6 space-y-2 bg-gray-700/95 backdrop-blur-lg border-t border-gray-600/50">
              <button 
                onClick={() => {setActivePage('home'); setIsMobileMenuOpen(false);}}
                className={`block w-full text-left px-4 py-3 transition-all duration-200 text-sm font-medium focus:outline-none rounded-xl ${
                  activePage === 'home' ? 'text-white bg-yellow-400/20 border-l-4 border-yellow-400' : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                Accueil
              </button>
              <button 
                onClick={() => {setActivePage('restaurant'); setIsMobileMenuOpen(false);}}
                className={`block w-full text-left px-4 py-3 transition-all duration-200 text-sm font-medium focus:outline-none rounded-xl ${
                  activePage === 'restaurant' ? 'text-white bg-yellow-400/20 border-l-4 border-yellow-400' : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                Notre Restaurant
              </button>
              <button 
                onClick={() => {setActivePage('carte'); setIsMobileMenuOpen(false);}}
                className={`block w-full text-left px-4 py-3 transition-all duration-200 text-sm font-medium focus:outline-none rounded-xl ${
                  activePage === 'carte' ? 'text-white bg-yellow-400/20 border-l-4 border-yellow-400' : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                La Carte
              </button>
              <button 
                onClick={() => {setActivePage('localisation'); setIsMobileMenuOpen(false);}}
                className={`block w-full text-left px-4 py-3 transition-all duration-200 text-sm font-medium focus:outline-none rounded-xl ${
                  activePage === 'localisation' ? 'text-white bg-yellow-400/20 border-l-4 border-yellow-400' : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                Où nous trouver ?
              </button>
              <button 
                onClick={() => {setActivePage('rejoindre'); setIsMobileMenuOpen(false);}}
                className={`block w-full text-left px-4 py-3 transition-all duration-200 text-sm font-medium focus:outline-none rounded-xl ${
                  activePage === 'rejoindre' ? 'text-white bg-yellow-400/20 border-l-4 border-yellow-400' : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                Nous Rejoindre
              </button>
              
              {/* Bouton Commander - Mobile */}
              <Link href="/Commande">
                <button className="w-full mt-6 bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 hover:from-yellow-500 hover:via-orange-500 hover:to-red-500 text-black font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-yellow-500/50 focus:outline-none flex items-center justify-center space-x-2 tracking-wide"
                  style={{ fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif" }}
                >
                  <span className="font-semibold">COMMANDER</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </Link>
            </div>
          </div>
      </header>

      {/* Arrière-plan fixe sur tout l'écran */}
      <div className="fixed inset-0 w-full h-full">

        {/* Image d'arrière-plan principale */}
        <div className="absolute inset-0 z-10 overflow-hidden">
          <div 
            className="absolute w-full h-full"
            style={{
              backgroundImage: 'url(/bgmainpage.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'right center',
              backgroundRepeat: 'no-repeat',
              width: '100vw',
              height: '100vh',
            }}
          />
        </div>
        {/* Vidéo en arrière-plan (z-index le plus bas) */}
        {/* <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-20 w-full h-[calc(100vh-5rem)] object-cover z-0"
        >
          <source src="/burger0.mp4" type="video/mp4" />
          Votre navigateur ne supporte pas la lecture de vidéos.
        </video> 
        
         {/* Image d'arrière-plan principale */}
        { <div className="absolute inset-0 z-10 overflow-hidden">
          <div 
            className="absolute w-full h-full"
            style={{
              backgroundImage: 'url(/BGTEST.png)',
              backgroundSize: 'auto',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              transform: 'scale(1.3) scaleX(-3) translateY(-200px) translateX(40px)',
              transformOrigin: 'center center',
              width: '100vw',
              height: '100vh',
              minWidth: '1920px',
              minHeight: '1080px',
              opacity: 0.7,
            }}
          />
        </div> } 
        
        {/* Overlay sombre pour améliorer la lisibilité */}
        <div className={`absolute inset-0 bg-black/50 bg-opacity-40 z-20 transition-all duration-300 ${
          activePage !== 'home' ? 'backdrop-blur-md' : ''
        }`}></div>
      </div>

      {/* Contenu principal qui prend tout l'écran */}
      <div className="relative z-30 min-h-screen overflow-y-auto flex flex-col">
        {/* Espace pour le header */}
        <div className="h-20 flex-shrink-0"></div>
        {activePage === 'home' && (
          <div className="flex-1 flex flex-col items-center justify-start w-full">
            {/* Hero Section */}
            <div className="w-full max-w-4xl px-4 sm:px-6 pt-16 sm:pt-20 pb-12 sm:pb-16 mx-auto">
              {/* Conteneur principal avec fond semi-transparent */}
              <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md rounded-3xl p-8 sm:p-12 border border-gray-600/50 shadow-2xl shadow-black/50 relative overflow-hidden group">
                {/* Éléments décoratifs en arrière-plan */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full blur-3xl group-hover:scale-150 transition-all duration-700"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-full blur-2xl group-hover:scale-125 transition-all duration-700"></div>
                
                {/* Ligne décorative en haut */}
                <div className="w-[95%] h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mx-auto mb-8 animate-pulse"></div>
                
                {/* Contenu principal */}
                <div className="text-center text-white relative z-10">
                  {/* Titre principal avec effet de gradient */}
                  <h1 className="text-5xl sm:text-5xl md:text-7xl xl:text-7xl font-bold mb-6 sm:mb-8 drop-shadow-2xl animate-in slide-in-from-bottom duration-700 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                    Delice Wand
                  </h1>
                  
                  {/* Sous-titre avec style amélioré */}
                  <p className="text-xl sm:text-2xl xl:text-3xl font-semibold mb-8 max-w-4xl mx-auto leading-relaxed text-white drop-shadow-lg animate-in slide-in-from-bottom duration-700 delay-200">
                    Une expérience culinaire unique qui réveille vos papilles
                  </p>
                  
                  {/* Description avec style cohérent */}
                  <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 mb-12 max-w-3xl mx-auto animate-in slide-in-from-bottom duration-700 delay-300">
                    <p className="text-base sm:text-lg leading-relaxed text-gray-200">
                      Découvrez nos burgers artisanaux, nos accompagnements frais et nos saveurs authentiques. 
                      Le meilleur du snack à portée de clic !
                    </p>
                  </div>
                  
                  {/* Boutons d'action avec style amélioré */}
                  <div className="flex flex-col sm:flex-row gap-6 justify-center animate-in slide-in-from-bottom duration-700 delay-400">
                    <Link href="/Commande">
                      <button className="group bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 hover:from-yellow-500 hover:via-orange-500 hover:to-red-500 text-black font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/50 focus:outline-none text-lg overflow-hidden tracking-wide shadow-lg relative"
                        style={{ fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif" }}
                      >
                        <span className="relative z-10 flex items-center space-x-3">
                          <span className="font-semibold">COMMANDER MAINTENANT</span>
                          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </span>
                        <div className="absolute inset-0 bg-white/20 translate-x-full group-hover:translate-x-0 transition-transform duration-500 skew-x-12"></div>
                      </button>
                    </Link>
                    
                    <button 
                      onClick={() => setActivePage('carte')}
                      className="group bg-transparent border-2 border-white/30 text-white font-bold py-4 px-8 rounded-2xl focus:outline-none text-lg backdrop-blur-sm hover:border-yellow-400/50 hover:bg-yellow-400/10 transition-all duration-300 hover:scale-105"
                    >
                      <span className="flex items-center space-x-3">
                        <span>VOIR LA CARTE</span>
                        <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </span>
                    </button>
                  </div>
                </div>
                
                {/* Ligne décorative en bas */}
                <div className="w-[95%] h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mx-auto mt-8 animate-pulse"></div>
              </div>
            </div>

            {/* Section Statistiques */}
            <div className="w-full max-w-6xl px-4 mb-16">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">Notre Service</h2>
                <div className="w-[30%] h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mx-auto"></div>
              </div>
            </div>
            <div className="w-full max-w-6xl px-4 mb-16">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <span className="text-2xl">🍔</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">50+</h3>
                    <p className="text-gray-200">Burgers uniques</p>
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <span className="text-2xl">⭐</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">4.8/5</h3>
                    <p className="text-gray-200">Note clients</p>
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <span className="text-2xl">🚀</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">15min</h3>
                    <p className="text-gray-200">Livraison rapide</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section Spécialités */}
            <div className="w-full max-w-6xl px-4 mb-16">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">Nos Spécialités</h2>
                <div className="w-[30%] h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mx-auto"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="group bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md rounded-2xl p-6 border border-gray-600/50 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/20">
                  <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl">🔥</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Burgers Signature</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Nos burgers artisanaux préparés avec des ingrédients frais et des recettes secrètes transmises de génération en génération.
                  </p>
                </div>
                
                <div className="group bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md rounded-2xl p-6 border border-gray-600/50 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/20">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl">🥗</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Ingrédients Frais</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Nous sélectionnons avec soin les meilleurs ingrédients locaux pour garantir fraîcheur et qualité dans chaque bouchée.
                  </p>
                </div>
                
                <div className="group bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md rounded-2xl p-6 border border-gray-600/50 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/20">
                  <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Service Rapide</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Commandez en ligne et recevez votre repas en 15 minutes. Rapidité et qualité, c&apos;est notre promesse !
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activePage === 'restaurant' && (
          <div className="flex-1 flex items-center justify-center pt-8">
            <div className="text-center h-[95%] w-full md:w-[80%] p-8 bg-gradient-to-br from-gray-800/95 to-gray-900/95 rounded-2xl shadow-2xl border border-gray-600/50 backdrop-blur-md flex flex-col overflow-y-auto">
              <div className="mb-8">
                <h2 className="text-4xl font-bold text-white mb-3 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent text-center">Notre Restaurant</h2>
                <div className="h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mx-auto" style={{ width: '300px' }}></div>
              </div>
              
              {/* Section Histoire */}
              <div className="mb-8 text-left">
                <div className="inline-block bg-gradient-to-br from-gray-700/60 to-gray-800/60 rounded-lg p-4 border border-gray-600/30 shadow-md mb-4">
                  <h3 className="text-2xl font-bold text-white mb-0 flex items-center">
                    <span className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mr-3 text-black text-sm font-bold">1</span>
                    Notre Histoire
                  </h3>
                </div>
                <p className="text-lg text-gray-200 leading-relaxed mb-4">
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit. Veritatis beatae nemo impedit. Distinctio officiis earum minus, non maiores tenetur sunt. Provident nam maiores ratione dolores, omnis laboriosam praesentium possimus inventore!
                </p>
                <div className="w-full md:w-[30%] h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mx-auto mt-5 mb-8"></div>
              </div>

              {/* Section Valeurs */}
              <div className="mb-8 text-left">
                <div className="inline-block bg-gradient-to-br from-gray-700/60 to-gray-800/60 rounded-lg p-4 border border-gray-600/30 shadow-md mb-4">
                  <h3 className="text-2xl font-bold text-white mb-0 flex items-center">
                    <span className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mr-3 text-black text-sm font-bold">2</span>
                    Nos Valeurs
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                    <h4 className="text-lg font-semibold text-white mb-2">Qualité</h4>
                    <p className="text-gray-300">Ingrédients frais et de saison</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                    <h4 className="text-lg font-semibold text-white mb-2">Durabilité</h4>
                    <p className="text-gray-300">Emballages écologiques et approvisionnement local</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                    <h4 className="text-lg font-semibold text-white mb-2">Communauté</h4>
                    <p className="text-gray-300">Support des producteurs locaux</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                    <h4 className="text-lg font-semibold text-white mb-2">Innovation</h4>
                    <p className="text-gray-300">Recettes créatives et techniques modernes</p>
                  </div>
                </div>
                <div className="md:w-[30%] w-full h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mx-auto mt-5 mb-8"></div>
              </div>
              

              {/* Section Équipe */}
              <div className="text-left">
                <div className="inline-block bg-gradient-to-br from-gray-700/60 to-gray-800/60 rounded-lg p-4 border border-gray-600/30 shadow-md mb-4">
                  <h3 className="text-2xl font-bold text-white mb-0 flex items-center">
                    <span className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center mr-3 text-black text-sm font-bold">3</span>
                    Notre Équipe
                  </h3>
                </div>
                <p className="text-lg text-gray-200 leading-relaxed mb-4">
                  Notre équipe passionnée travaille chaque jour pour vous offrir une meilleure expérience 
                  culinaire avec des produits frais et de qualité.
                </p>
                <div className="flex justify-center">
                  <button className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105">
                    Rejoindre l&apos;équipe
                  </button>
                </div>
                <div className="w-full md:w-[30%] h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mx-auto mt-5 mb-8"></div>
              </div>
            </div>
          </div>
        )}
        
        {activePage === 'carte' && (
          <div className="flex-1 flex items-center justify-center pt-8">
            <div className="text-center h-[95%] w-full md:w-[80%] p-8 bg-gradient-to-br from-gray-800/95 to-gray-900/95 rounded-2xl shadow-2xl border border-gray-600/50 backdrop-blur-md flex flex-col overflow-y-auto">
              <h2 className="text-4xl font-bold text-white mb-3 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">LA CARTE</h2>
              <div className="h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mx-auto" style={{ width: '300px' }}></div>
              
              {/* Section Catégories */}
              <div className="mb-8 text-left">
                <div className="inline-block bg-gradient-to-br from-gray-700/60 to-gray-800/60 rounded-lg p-4 border border-gray-600/30 shadow-md mb-6">
                  <h3 className="text-2xl font-bold text-white mb-0 flex items-center">
                    Nos Catégories
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group bg-gradient-to-br from-gray-700/80 to-gray-800/80 rounded-xl p-6 border border-gray-600/50 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105">
                    <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <span className="text-2xl">🍽️</span>
                    </div>
                    <h4 className="text-xl font-bold text-white mb-3">Assiettes</h4>
                    <p className="text-gray-300 mb-4">Nos délicieuses assiettes composées avec des ingrédients frais et locaux.</p>
                    <div className="text-yellow-400 font-semibold">À partir de 9.50€</div>
                  </div>
                  
                  <div className="group bg-gradient-to-br from-gray-700/80 to-gray-800/80 rounded-xl p-6 border border-gray-600/50 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105">
                    <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <span className="text-2xl">🍟</span>
                    </div>
                    <h4 className="text-xl font-bold text-white mb-3">Accompagnements</h4>
                    <p className="text-gray-300 mb-4">Frites maison, salades fraîches et autres délices pour accompagner vos plats.</p>
                    <div className="text-yellow-400 font-semibold">À partir de 2.50€</div>
                  </div>
                  
                  <div className="group bg-gradient-to-br from-gray-700/80 to-gray-800/80 rounded-xl p-6 border border-gray-600/50 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <span className="text-2xl">🥤</span>
                    </div>
                    <h4 className="text-xl font-bold text-white mb-3">Boissons</h4>
                    <p className="text-gray-300 mb-4">Sodas, jus naturels et boissons rafraîchissantes pour étancher votre soif.</p>
                    <div className="text-yellow-400 font-semibold">À partir de 2€</div>
                  </div>
                  
                  <div className="group bg-gradient-to-br from-gray-700/80 to-gray-800/80 rounded-xl p-6 border border-gray-600/50 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <span className="text-2xl">🍰</span>
                    </div>
                    <h4 className="text-xl font-bold text-white mb-3">Desserts</h4>
                    <p className="text-gray-300 mb-4">Délicieuses pâtisseries et desserts maison pour terminer votre repas en beauté.</p>
                    <div className="text-yellow-400 font-semibold">À partir de 3€</div>
                  </div>
                </div>
                <div className="w-full md:w-[30%] h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mx-auto mt-5 mb-8"></div>
              </div>

              {/* Call to Action */}
              <div className="text-center">
                <p className="text-lg text-gray-200 mb-6">
                  Découvrez notre menu complet et commandez en ligne pour une expérience culinaire exceptionnelle !
                </p>
                <Link href="/Commande">
                  <button className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold py-4 px-8 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/50"
                    style={{ fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif" }}
                  >
                    <span className="font-semibold">VOIR LE MENU COMPLET</span>
                  </button>
                </Link>
                <div className="w-full md:w-[30%] h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mx-auto mt-5 mb-8"></div>
              </div>
            </div>
          </div>
        )}
        
        {activePage === 'localisation' && (
          <div className="flex-1 flex items-center justify-center pt-8">
            <div className="text-center h-[95%] w-full md:w-[80%] p-8 bg-gradient-to-br from-gray-800/95 to-gray-900/95 rounded-2xl shadow-2xl border border-gray-600/50 backdrop-blur-md flex flex-col overflow-y-auto">
              <h2 className="text-4xl font-bold text-white mb-3 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">OÙ NOUS TROUVER ?</h2>
              <div className="h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mx-auto" style={{ width: '300px' }}></div>

              {/* Section Adresse */}
              <div className="mb-8 text-left">
                <div className="inline-block bg-gradient-to-br from-gray-700/60 to-gray-800/60 rounded-lg p-4 border border-gray-600/30 shadow-md mb-6">
                  <h3 className="text-2xl font-bold text-white mb-0 flex items-center">
                    <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-3 text-black text-sm font-bold">📍</span>
                    Notre Adresse
                  </h3>
                </div>
                <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-6 border border-blue-400/30">
                  <div className="flex items-center mb-4">
                    <span className="text-3xl mr-3">🏢</span>
                    <div>
                      <h4 className="text-xl font-bold text-white">Delice Wand</h4>
                      <p className="text-blue-300 text-sm">Restaurant & Snack</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-gray-200">
                    <p className="text-lg"><strong>Rue de Wand 64</strong></p>
                    <p className="text-lg">1020 Laeken, Bruxelles</p>
                    <p className="text-lg">Belgique</p>
                  </div>
                </div>
                <div className="w-full md:w-[30%] h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mx-auto mt-5 mb-8"></div>
              </div>

              {/* Section Horaires */}
              <div className="mb-8 text-left">
                <div className="inline-block bg-gradient-to-br from-gray-700/60 to-gray-800/60 rounded-lg p-4 border border-gray-600/30 shadow-md mb-6">
                  <h3 className="text-2xl font-bold text-white mb-0 flex items-center">
                    <span className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mr-3 text-black text-sm font-bold">🕒</span>
                    Horaires d&apos;Ouverture
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white/10 rounded-xl p-6 border border-white/20">
                    <h4 className="text-lg font-semibold text-white mb-4">Lundi - Vendredi</h4>
                    <div className="space-y-2 text-gray-200">
                      <p><span className="text-yellow-400">🌅</span> 11h00 - 14h30</p>
                      <p><span className="text-orange-400">🌆</span> 17h30 - 22h00</p>
                    </div>
                  </div>
                  <div className="bg-white/10 rounded-xl p-6 border border-white/20">
                    <h4 className="text-lg font-semibold text-white mb-4">Samedi - Dimanche</h4>
                    <div className="space-y-2 text-gray-200">
                      <p><span className="text-yellow-400">🌅</span> 11h00 - 23h00</p>
                      <p className="text-gray-400 text-sm">Ouvert en continu</p>
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-[30%] h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mx-auto mt-5 mb-8"></div>
              </div>

              {/* Section Contact */}
              <div className="mb-8 text-left">
                <div className="inline-block bg-gradient-to-br from-gray-700/60 to-gray-800/60 rounded-lg p-4 border border-gray-600/30 shadow-md mb-6">
                  <h3 className="text-2xl font-bold text-white mb-0 flex items-center">
                    <span className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mr-3 text-black text-sm font-bold">📞</span>
                    Nous Contacter
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-xl p-6 border border-yellow-400/30">
                    <div className="flex items-center mb-4">
                      <span className="text-2xl mr-3">📱</span>
                      <div>
                        <h4 className="text-lg font-semibold text-white">Téléphone</h4>
                        <p className="text-yellow-300 text-sm">Appelez-nous</p>
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-yellow-400">02 468 12 76</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-400/20 to-blue-500/20 rounded-xl p-6 border border-green-400/30">
                    <div className="flex items-center mb-4">
                      <span className="text-2xl mr-3">✉️</span>
                      <div>
                        <h4 className="text-lg font-semibold text-white">Email</h4>
                        <p className="text-green-300 text-sm">Écrivez-nous</p>
                      </div>
                    </div>
                    <p className="text-lg font-semibold text-green-400">contact@delicewand.be</p>
                  </div>
                </div>
                <div className="w-full md:w-[30%] h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mx-auto mt-5 mb-8"></div>
              </div>
              
              {/* Google Map */}
              <div className="w-full h-80 mb-8 rounded-xl overflow-hidden border border-gray-600/50">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2518.6666!2d4.3556!3d50.8863!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c3c47e5b5b1234%3A0x5678!2sRue%20de%20Wand%2064%2C%201020%20Laeken%2C%20Belgium!5e0!3m2!1sfr!2sfr!4v1234567890123!5m2!1sfr!2sfr"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-xl"
                />
                <div className="w-full md:w-[30%] h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mx-auto mt-5 mb-8"></div>
              </div>
              
              {/* Call to Action */}
              <div className="text-center">
                <p className="text-lg text-gray-200 mb-6">
                  Venez nous rendre visite et découvrez notre ambiance chaleureuse et nos délicieuses spécialités !
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/Commande">
                    <button className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105"
                      style={{ fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif" }}
                    >
                      <span className="font-semibold">COMMANDER EN LIGNE</span>
                    </button>
                  </Link>
                  <button className="bg-transparent border-2 border-white/30 hover:border-white text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 hover:bg-white/10">
                    <span>RÉSERVER UNE TABLE</span>
                  </button>
                </div>
                <div className="w-full md:w-[30%] h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mx-auto mt-5 mb-8"></div>
              </div>
            </div>
          </div>
        )}
        
        {activePage === 'rejoindre' && (
          <div className="flex-1 flex items-center justify-center pt-8">
            <div className="text-center h-[95%] w-full md:w-[80%] p-8 bg-gradient-to-br from-gray-800/95 to-gray-900/95 rounded-2xl shadow-2xl border border-gray-600/50 backdrop-blur-md flex flex-col overflow-y-auto">
              <h2 className="text-4xl font-bold text-white mb-8 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">Rejoindre la Communauté</h2>
              <div className="h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mx-auto" style={{ width: '300px' }}></div>
              
              {/* Section Introduction */}
              <div className="mb-8 text-left">
                <div className="inline-block bg-gradient-to-br from-gray-700/60 to-gray-800/60 rounded-lg p-4 border border-gray-600/30 shadow-md mb-6">
                  <h3 className="text-2xl font-bold text-white mb-0 flex items-center">
                    <span className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mr-3 text-black text-sm font-bold">🌟</span>
                    Rejoignez Notre Communauté
                  </h3>
                </div>
                <p className="text-lg text-gray-200 leading-relaxed mb-6">
                  Restez connecté avec Delice Wand et découvrez en avant-première nos nouvelles créations, 
                  nos offres spéciales et les coulisses de notre restaurant ! Rejoignez notre communauté 
                  de passionnés de gastronomie.
                </p>
                <div className="bg-gradient-to-r from-green-400/20 to-blue-500/20 rounded-xl p-6 border border-green-400/30">
                  <h4 className="text-xl font-bold text-white mb-3">Pourquoi nous suivre ?</h4>
                  <ul className="text-gray-200 space-y-2">
                    <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> Découvrez nos nouvelles recettes en avant-première</li>
                    <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> Offres exclusives et promotions spéciales</li>
                    <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> Coups de cœur du chef et conseils culinaires</li>
                    <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> Photos et vidéos des coulisses</li>
                  </ul>
                </div>
                <div className="w-full md:w-[30%] h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mx-auto mt-5 mb-8"></div>
              </div>

              {/* Section Réseaux Sociaux */}
              <div className="mb-8 text-left">
                <div className="inline-block bg-gradient-to-br from-gray-700/60 to-gray-800/60 rounded-lg p-4 border border-gray-600/30 shadow-md mb-6">
                  <h3 className="text-2xl font-bold text-white mb-0 flex items-center">
                    <span className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mr-3 text-black text-sm font-bold">📱</span>
                    Nos Réseaux Sociaux
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group bg-gradient-to-br from-gray-700/80 to-gray-800/80 rounded-xl p-6 border border-gray-600/50 hover:border-blue-400/50 transition-all duration-300 hover:scale-105">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </div>
                    <h4 className="text-xl font-bold text-white mb-3">Facebook</h4>
                    <p className="text-gray-300 mb-4">Suivez-nous pour nos actualités, photos et événements.</p>
                    <div className="text-blue-400 font-semibold">@DeliceWand</div>
                  </div>
                  
                  <div className="group bg-gradient-to-br from-gray-700/80 to-gray-800/80 rounded-xl p-6 border border-gray-600/50 hover:border-pink-400/50 transition-all duration-300 hover:scale-105">
                    <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Image 
                        src="/instaicone.png" 
                        alt="Instagram" 
                        width={64} 
                        height={64}
                        className="w-14 h-14"
                      />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-3">Instagram</h4>
                    <p className="text-gray-300 mb-4">Découvrez nos plats en photos et stories quotidiennes.</p>
                    <div className="text-pink-400 font-semibold">@delicewand</div>
                  </div>
                  
                  <div className="group bg-gradient-to-br from-gray-700/80 to-gray-800/80 rounded-xl p-6 border border-gray-600/50 hover:border-red-400/50 transition-all duration-300 hover:scale-105">
                    <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                      </svg>
                    </div>
                    <h4 className="text-xl font-bold text-white mb-3">TikTok</h4>
                    <p className="text-gray-300 mb-4">Vidéos courtes et fun de nos créations culinaires.</p>
                    <div className="text-red-400 font-semibold">@delicewand</div>
                  </div>
                  
                  <div className="group bg-gradient-to-br from-gray-700/80 to-gray-800/80 rounded-xl p-6 border border-gray-600/50 hover:border-green-400/50 transition-all duration-300 hover:scale-105">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.374l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                      </svg>
                    </div>
                    <h4 className="text-xl font-bold text-white mb-3">WhatsApp</h4>
                    <p className="text-gray-300 mb-4">Commandes spéciales et questions personnalisées.</p>
                    <div className="text-green-400 font-semibold">+32 468 12 76</div>
                  </div>
                </div>
                <div className="w-full md:w-[30%] h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mx-auto mt-5 mb-8"></div>
              </div>

              {/* Section Événements */}
              <div className="mb-8 text-left">
                <div className="inline-block bg-gradient-to-br from-gray-700/60 to-gray-800/60 rounded-lg p-4 border border-gray-600/30 shadow-md mb-6">
                  <h3 className="text-2xl font-bold text-white mb-0 flex items-center">
                    <span className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mr-3 text-black text-sm font-bold">🎉</span>
                    Événements & Anniversaires
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white/10 rounded-xl p-6 border border-white/20">
                    <h4 className="text-lg font-semibold text-white mb-3">🍔 Anniversaires gourmands</h4>
                    <p className="text-gray-300 mb-3">Découvrez nos nouvelles créations en avant-première</p>
                    <p className="text-yellow-400 text-sm">Contactez-nous pour plus d&apos;informations</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-6 border border-white/20">
                    <h4 className="text-lg font-semibold text-white mb-3">🎭 Soirées Privatisées</h4>
                    <p className="text-gray-300 mb-3">Soirées privées pour vos événements</p>
                    <p className="text-yellow-400 text-sm">Contactez-nous pour plus d&apos;informations</p>
                  </div>
                </div>
                <div className="w-full md:w-[30%] h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mx-auto mt-5 mb-8"></div>
              </div>

              {/* Call to Action */}
              <div className="text-center">
                <p className="text-lg text-gray-200 mb-6">
                  Rejoignez notre communauté et restez connecté avec Delice Wand !
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold py-4 px-8 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/50">
                    <span className="font-semibold">SUIVRE SUR INSTAGRAM</span>
                  </button>
                  <button className="bg-transparent border-2 border-white/30 hover:border-white text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 hover:scale-105 hover:bg-white/10">
                    <span>VOIR TOUS NOS RÉSEAUX</span>
                  </button>
                </div>
                <div className="w-full md:w-[30%] h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mx-auto mt-5 mb-8"></div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Espace en bas pour s'assurer que tout le contenu soit visible */}
      <div className="h-20"></div>
    </div>
  );
}
