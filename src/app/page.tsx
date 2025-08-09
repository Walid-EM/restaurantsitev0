"use client";
import Image from "next/image";
import Link from "next/link";

import { useState, useEffect } from "react";

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSubmenuOpen, setIsMobileSubmenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activePage, setActivePage] = useState('home');

  const toggleMobileMenu = () => {
    console.log('Toggle mobile menu clicked');
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleMobileSubmenu = () => {
    console.log('Toggle mobile submenu clicked, current state:', isMobileSubmenuOpen);
    const newState = !isMobileSubmenuOpen;
    setIsMobileSubmenuOpen(newState);
    console.log('New state will be:', newState);
  };



  const sliderImages = [
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23ff6b6b'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='white' font-family='Arial' font-size='24'%3EBurger Classic%3C/text%3E%3C/svg%3E",
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23ff6b6b'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='white' font-family='Arial' font-size='24'%3EBurger Deluxe%3C/text%3E%3C/svg%3E",
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23ff6b6b'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='white' font-family='Arial' font-size='24'%3EBurger Premium%3C/text%3E%3C/svg%3E",
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23ff6b6b'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='white' font-family='Arial' font-size='24'%3EBurger Special%3C/text%3E%3C/svg%3E",
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23ff6b6b'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='white' font-family='Arial' font-size='24'%3EBurger Gourmet%3C/text%3E%3C/svg%3E",
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23ff6b6b'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='white' font-family='Arial' font-size='24'%3EBurger Royal%3C/text%3E%3C/svg%3E",
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23ff6b6b'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='white' font-family='Arial' font-size='24'%3EBurger Supreme%3C/text%3E%3C/svg%3E"
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => Math.min(prev + 1, sliderImages.length - 3));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
  };

  const nextSlideMobile = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
  };

  const prevSlideMobile = () => {
    setCurrentSlide((prev) => (prev - 1 + sliderImages.length) % sliderImages.length);
  };



  // Interactions clavier pour PC
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (window.innerWidth >= 1500) {
        // Desktop controls
        switch(e.key) {
          case 'ArrowLeft':
            e.preventDefault();
            prevSlide();
            break;
          case 'ArrowRight':
            e.preventDefault();
            nextSlide();
            break;
          case 'Escape':
            setIsMobileMenuOpen(false);
            break;
        }
      } else {
        // Mobile controls
        switch(e.key) {
          case 'ArrowLeft':
            e.preventDefault();
            prevSlideMobile();
            break;
          case 'ArrowRight':
            e.preventDefault();
            nextSlideMobile();
            break;
          case 'Escape':
            setIsMobileMenuOpen(false);
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [nextSlide, nextSlideMobile, prevSlide, prevSlideMobile]);

  // Auto-play pour mobile (optionnel)
  useEffect(() => {
    if (window.innerWidth < 1500) {
      const interval = setInterval(() => {
        nextSlideMobile();
      }, 5000); // Change d'image toutes les 5 secondes

      return () => clearInterval(interval);
    }
  }, [nextSlideMobile]);

  // Debug: Surveiller les changements d'état du sous-menu mobile
  useEffect(() => {
    console.log('isMobileSubmenuOpen changed to:', isMobileSubmenuOpen);
  }, [isMobileSubmenuOpen]);



  return (
    <div className="min-h-screen bg-gray-50 overflow-hidden">
      {/* Header avec navigation */}
      <header className="bg-black/60 backdrop-blur-sm text-white fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Menu hamburger - Mobile (gauche) */}
            <button 
              onClick={toggleMobileMenu}
              className="xl:hidden text-white p-2 focus:outline-none"
              aria-label="Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Logo centré - Mobile */}
            <button 
              onClick={() => setActivePage('home')}
              className="xl:hidden flex-shrink-0 focus:outline-none"
            >
              <Image
                src="/cheeseburger.png"
                alt="Cheeseburger Logo"
                width={120}
                height={40}
                className="h-10 w-auto"
              />
            </button>

            {/* Logo à gauche - Desktop */}
            <button 
              onClick={() => setActivePage('home')}
              className="hidden xl:block flex-shrink-0 focus:outline-none"
            >
              <Image
                src="/cheeseburger.png"
                alt="Cheeseburger Logo"
                width={120}
                height={40}
                className="h-10 w-auto"
              />
            </button>

            {/* Menu de navigation centré - Desktop */}
            <nav className="hidden xl:flex items-center space-x-8">
              <button 
                onClick={() => setActivePage('restaurant')}
                className={`transition-colors duration-200 uppercase tracking-wide text-md font-medium focus:outline-none ${
                  activePage === 'restaurant' ? 'text-yellow-400' : 'text-white hover:text-yellow-400'
                }`}
              >
                Notre Restaurant
              </button>
              <button 
                onClick={() => setActivePage('carte')}
                className={`transition-colors duration-200 uppercase tracking-wide text-md font-medium focus:outline-none ${
                  activePage === 'carte' ? 'text-yellow-400' : 'text-white hover:text-yellow-400'
                }`}
              >
                La Carte
              </button>
              <button 
                onClick={() => setActivePage('localisation')}
                className={`transition-colors duration-200 uppercase tracking-wide text-md font-medium focus:outline-none ${
                  activePage === 'localisation' ? 'text-yellow-400' : 'text-white hover:text-yellow-400'
                }`}
              >
                Où nous trouver ?
              </button>
              <button 
                onClick={() => setActivePage('rejoindre')}
                className={`transition-colors duration-200 uppercase tracking-wide text-md font-medium focus:outline-none ${
                  activePage === 'rejoindre' ? 'text-yellow-400' : 'text-white hover:text-yellow-400'
                }`}
              >
                Nous Rejoindre
              </button>
            </nav>

            {/* Bouton Commander - Desktop */}
            <Link href="/Commande">
              <button 
                className="hidden xl:block bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-5 px-10 rounded-full transition-all duration-200 transform hover:scale-110 font-handwriting focus:outline-none"
              >
                COMMANDER
              </button>
            </Link>

            {/* Bouton Commander - Mobile (droite) */}
            <Link href="/Commande">
              <button 
                className="xl:hidden bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded-full transition-all duration-200 transform hover:scale-110 font-handwriting focus:outline-none text-sm"
              >
                COMMANDER
              </button>
            </Link>
          </div>

          {/* Menu mobile */}
          <div className={`xl:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
            <div className="px-2 pt-2 pb-3 space-y-1 bg-black border-t border-gray-700">
              <button 
                onClick={() => {setActivePage('restaurant'); setIsMobileMenuOpen(false);}}
                className={`block w-full text-left px-3 py-2 transition-colors duration-200 uppercase tracking-wide text-sm font-medium focus:outline-none ${
                  activePage === 'restaurant' ? 'text-yellow-400' : 'text-white hover:text-yellow-400'
                }`}
              >
                Notre Restaurant
              </button>
              <button 
                onClick={() => {setActivePage('carte'); setIsMobileMenuOpen(false);}}
                className={`block w-full text-left px-3 py-2 transition-colors duration-200 uppercase tracking-wide text-sm font-medium focus:outline-none ${
                  activePage === 'carte' ? 'text-yellow-400' : 'text-white hover:text-yellow-400'
                }`}
              >
                La Carte
              </button>
              <button 
                onClick={() => {setActivePage('localisation'); setIsMobileMenuOpen(false);}}
                className={`block w-full text-left px-3 py-2 transition-colors duration-200 uppercase tracking-wide text-sm font-medium focus:outline-none ${
                  activePage === 'localisation' ? 'text-yellow-400' : 'text-white hover:text-yellow-400'
                }`}
              >
                Où nous trouver ?
              </button>
              <button 
                onClick={() => {setActivePage('rejoindre'); setIsMobileMenuOpen(false);}}
                className={`block w-full text-left px-3 py-2 transition-colors duration-200 uppercase tracking-wide text-sm font-medium focus:outline-none ${
                  activePage === 'rejoindre' ? 'text-yellow-400' : 'text-white hover:text-yellow-400'
                }`}
              >
                Nous Rejoindre
              </button>
              <Link href="/Commande">
                <button 
                  className="w-full mt-4 bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-6 rounded-full transition-all duration-200 transform hover:scale-110 font-handwriting focus:outline-none"
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
          <div className="flex-1 flex items-center justify-start">
            <div className="text-start text-white px-4">
              <h1 className="text-4xl sm:text-6xl xl:text-8xl font-bold mb-4 sm:mb-6 drop-shadow-2xl pl-9 pt-[10vh]">
                Delice Wand
              </h1>
              <p className="text-lg sm:text-xl xl:text-2xl drop-shadow-lg pl-10 pt-[30vh] mb-4">
                Une expérience culinaire unique
              </p>
              <p className="text-sm drop-shadow-lg max-w-3xl pl-10">
                Le meilleur du snack à porter de clique truc de fou sah moi si j&apos;étais toi j&apos;aurais commandé direct jsais pas t&apos;attends quoi sah commande t&apos;es serieux t&apos;es encore entrain de lire frere ? 
              </p>
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
        
        {activePage === 'localisation' && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center h-[95%] w-full md:w-[60%] p-8 bg-black/95 rounded-lg shadow-2xl flex flex-col">
              <h2 className="text-4xl font-bold text-white mb-8">OÙ NOUS TROUVER ?</h2>
              
              {/* Google Map */}
              <div className="w-full h-84 mt-10 mb-6 rounded-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2518.6666!2d4.3556!3d50.8863!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c3c47e5b5b1234%3A0x5678!2sRue%20de%20Wand%2064%2C%201020%20Laeken%2C%20Belgium!5e0!3m2!1sfr!2sfr!4v1234567890123!5m2!1sfr!2sfr"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-lg"
                />
              </div>
              
              {/* Informations en bas */}
              <div className="flex justify-between items-start mt-[5vh] pl-[1vw] pr-[1vw]">
                {/* Adresse et téléphone à gauche */}
                <div className="text-left text-white">
                  <h3 className="text-md font-bold mb-2">Adresse</h3>
                  <p className="text-sm mb-1">Rue de Wand 64</p>
                  <p className="text-sm mb-3">1020 Laeken, Bruxelles</p>
                  <h3 className="text-md font-bold mb-2">Téléphone</h3>
                  <p className="text-sm">02 468 12 76</p>
                </div>
                
                {/* Message à droite */}
                <div className="text-right text-white">
                  <p className="text-lg font-semibold">Venez nous voir !</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activePage === 'rejoindre' && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center h-[95%] w-full md:w-[60%] p-8 bg-black/95 rounded-lg shadow-2xl flex flex-col">
              <h2 className="text-4xl font-bold text-white mb-8">Nous Rejoindre</h2>
              <p className="text-lg text-white max-w-2xl mx-auto mt-[30vh]">
                Rejoignez notre équipe et participez à l'aventure Delice Wand.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
