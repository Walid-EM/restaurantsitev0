"use client";
import Image from "next/image";
import Link from "next/link";

import { useState, useEffect } from "react";

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSubmenuOpen, setIsMobileSubmenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

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
    <div className="min-h-screen bg-gray-50">
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
            <div className="xl:hidden flex-shrink-0">
              <Image
                src="/cheeseburger.png"
                alt="Cheeseburger Logo"
                width={120}
                height={40}
                className="h-10 w-auto"
              />
            </div>

            {/* Logo à gauche - Desktop */}
            <div className="hidden xl:block flex-shrink-0">
              <Image
                src="/cheeseburger.png"
                alt="Cheeseburger Logo"
                width={120}
                height={40}
                className="h-10 w-auto"
              />
            </div>

            {/* Menu de navigation centré - Desktop */}
            <nav className="hidden xl:flex items-center space-x-8">
              <a href="#" className="text-white hover:text-yellow-400 transition-colors duration-200 uppercase tracking-wide text-md font-medium focus:outline-none">
                Notre Restaurant
              </a>
              <div className="relative group">
                <a href="#" className="text-white hover:text-yellow-400 transition-colors duration-200 uppercase tracking-wide text-md font-medium flex items-center focus:outline-none">
                  La Carte
                  <svg className="ml-1 w-4 h-4 transform group-hover:rotate-180 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </a>
                {/* Sous-menu */}
                <div className="absolute top-full left-0 mt-2 w-48 bg-black border border-gray-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <a href="#" className="block px-4 py-2 text-md hover:bg-gray-800 transition-colors duration-200 focus:bg-gray-800 focus:outline-none">Burgers</a>
                  <a href="#" className="block px-4 py-2 text-md hover:bg-gray-800 transition-colors duration-200 focus:bg-gray-800 focus:outline-none">Frites & Accompagnements</a>
                  <a href="#" className="block px-4 py-2 text-md hover:bg-gray-800 transition-colors duration-200 focus:bg-gray-800 focus:outline-none">Boissons</a>
                  <a href="#" className="block px-4 py-2 text-md hover:bg-gray-800 transition-colors duration-200 focus:bg-gray-800 focus:outline-none">Desserts</a>
                </div>
              </div>
              <a href="#" className="text-white hover:text-yellow-400 transition-colors duration-200 uppercase tracking-wide text-dm font-medium focus:outline-none">
                Où nous trouver ?
              </a>
              <a href="#" className="text-white hover:text-yellow-400 transition-colors duration-200 uppercase tracking-wide text-md font-medium focus:outline-none">
                Nous Rejoindre
              </a>
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
              <a href="#" className="block px-3 py-2 text-white hover:text-yellow-400 transition-colors duration-200 uppercase tracking-wide text-sm font-medium focus:outline-none">
                Notre Restaurant
              </a>
              <div className="relative">
                <button 
                  onClick={toggleMobileSubmenu}
                  className="w-full text-left px-3 py-2 text-white hover:text-yellow-400 transition-colors duration-200 uppercase tracking-wide text-sm font-medium focus:outline-none flex items-center justify-between"
                >
                  La Carte
                  <svg className={`w-4 h-4 transform transition-transform duration-200 ${isMobileSubmenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isMobileSubmenuOpen && (
                  <div className="pl-4 space-y-1 mt-2 border-l-2 border-gray-700">
                    <a href="#" className="block px-3 py-2 text-white hover:text-yellow-400 transition-colors duration-200 text-sm focus:outline-none">
                      Burgers
                    </a>
                    <a href="#" className="block px-3 py-2 text-white hover:text-yellow-400 transition-colors duration-200 text-sm focus:outline-none">
                      Frites & Accompagnements
                    </a>
                    <a href="#" className="block px-3 py-2 text-white hover:text-yellow-400 transition-colors duration-200 text-sm focus:outline-none">
                      Boissons
                    </a>
                    <a href="#" className="block px-3 py-2 text-white hover:text-yellow-400 transition-colors duration-200 text-sm focus:outline-none">
                      Desserts
                    </a>
                  </div>
                )}
              </div>
              <a href="#" className="block px-3 py-2 text-white hover:text-yellow-400 transition-colors duration-200 uppercase tracking-wide text-sm font-medium focus:outline-none">
                Devenir Franchisé
              </a>
              <a href="#" className="block px-3 py-2 text-white hover:text-yellow-400 transition-colors duration-200 uppercase tracking-wide text-sm font-medium focus:outline-none">
                Nous Rejoindre
              </a>
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

      {/* Section principale avec vidéo en arrière-plan */}
      <section className="relative h-screen w-full overflow-hidden">
        {/* Vidéo en arrière-plan */}
         <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/burger0.mp4" type="video/mp4" />
          Votre navigateur ne supporte pas la lecture de vidéos.
        </video> 
        
        {/* Overlay sombre pour améliorer la lisibilité */}
        <div className="absolute inset-0 bg-black/30 bg-opacity-40"></div>
        
        {/* Texte centré */}
        <div className="relative z-10 flex items-center justify-start h-full">
          <div className="text-start text-white px-4">
            <h1 className="text-4xl sm:text-6xl xl:text-8xl font-bold mb-4 sm:mb-6 drop-shadow-2xl pl-9">
              Delice Wand
            </h1>
            <p className="text-lg sm:text-xl xl:text-2xl drop-shadow-lg pl-10">
              Une expérience culinaire unique
            </p>
            <p className="text-sm  drop-shadow-lg max-w-3xl pt-10 pl-10">
              Le meilleur du snack à porter de clique truc de fou sah moi si j&apos;étais toi j&apos;aurais commandé direct jsais pas t&apos;attends quoi sah commande t&apos;es serieux t&apos;es encore entrain de lire frere ? 
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
