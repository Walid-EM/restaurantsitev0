"use client";
import Image from "next/image";
import Link from "next/link";

import { useState, useEffect } from "react";
import MongoDBTest from "./components/MongoDBTest";

// Types pour les données de la base
interface Category {
  _id: string;
  name: string;
  description: string;
  image: string;
  isActive: boolean;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isAvailable: boolean;
  
  // Nouvelles propriétés optionnelles inspirées de Bicky
  ingredients?: string[];
  isSpicy?: boolean;
  isVegetarian?: boolean;
  metadata?: Record<string, unknown>;
}

interface Extra {
  _id: string;
  name: string;
  price: number;
  image: string;
  isActive: boolean;
}

// Interface Bicky supprimée - utilisez Product avec category: 'bicky'

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState('home');
  const [currentSection, setCurrentSection] = useState('hero');
  const [isScrolled, setIsScrolled] = useState(false);
  
  // États pour les données de la base
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [extras, setExtras] = useState<Extra[]>([]);
  const [bickies, setBickies] = useState<Product[]>([]); // Maintenant des Products avec category: 'bicky'
  const [loading, setLoading] = useState(true);

  // Fonction pour récupérer les données
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Récupérer les catégories
      const categoriesRes = await fetch('/api/categories');
      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData.categories || []);
      }
      
      // Récupérer TOUS les produits via l'API unifiée
      const unifiedRes = await fetch('/api/products/unified');
      if (unifiedRes.ok) {
        const unifiedData = await unifiedRes.json();
        if (unifiedData.success && Array.isArray(unifiedData.products)) {
          // Séparer les produits classiques des Bicky
          const allProducts = unifiedData.products;
          const regularProducts = allProducts.filter((p: Product) => p.category !== 'bicky');
          
          setProducts(regularProducts);
          ;
        }
      }
      
      // Récupérer les extras
      const extrasRes = await fetch('/api/extras');
      if (extrasRes.ok) {
        const extrasData = await extrasRes.json();
        setExtras(extrasData.extras || []);
      }
      
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
    } finally {
      setLoading(false);
    }
  };

  // Charger les données au montage du composant
  useEffect(() => {
    fetchData();
  }, []);

  // Détection du scroll et des sections avec animations
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);

      // Détecter la section active basée sur la position de scroll
      const sections = [
        { id: 'hero', element: document.querySelector('[data-section="hero"]') },
        { id: 'stats', element: document.querySelector('[data-section="stats"]') },
        { id: 'philosophy', element: document.querySelector('[data-section="philosophy"]') },
        { id: 'cta', element: document.querySelector('[data-section="cta"]') }
      ];

      for (const section of sections) {
        if (section.element) {
          const rect = section.element.getBoundingClientRect();
          const elementTop = rect.top + window.scrollY;
          const elementBottom = elementTop + rect.height;
          
          // Si la section occupe au moins 30% de la hauteur visible
          if (scrollPosition >= elementTop - 200 && scrollPosition < elementBottom - 200) {
            setCurrentSection(section.id);
            
            // Déclencher les animations d'apparition pour cette section
            const animatedElements = section.element.querySelectorAll('[data-animate]');
            animatedElements.forEach((el, index) => {
              const delay = index * 0.2; // Délai progressif
              setTimeout(() => {
                el.classList.add('animate-in');
              }, delay * 1000);
            });
            
            break;
          }
        }
      }

      // Animation des éléments au scroll
      const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      }, observerOptions);

      // Observer tous les éléments avec data-animate
      document.querySelectorAll('[data-animate]').forEach((el) => {
        observer.observe(el);
      });

      return () => observer.disconnect();
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Appel initial

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  // Fonction pour obtenir les produits par catégorie
  const getProductsByCategory = (categoryName: string) => {
    return products.filter(product => product.category === categoryName.toLowerCase());
  };




  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header moderne et subtil */}
      <header className={`${
        isScrolled 
          ? 'bg-gradient-to-r from-black/60 via-gray-900/70 to-black/60 backdrop-blur-xl border-b border-white/20' 
          : 'bg-gradient-to-r from-black/30 via-gray-900/40 to-black/30 backdrop-blur-xl border-b border-white/10'
      } text-white fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out shadow-lg`}>
        
        <div className={`flex items-center w-full px-8 transition-all duration-300 ${
          isScrolled ? 'h-18' : 'h-20'
        }`}>

            {/* Logo à gauche */}
            <div className="flex-shrink-0">
              <button 
                onClick={() => {
                  setActivePage('home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="focus:outline-none group px-6 py-4 rounded-xl hover:bg-white/5 transition-all duration-300"
              >
                <h1 className={`font-light text-white tracking-[0.2em] group-hover:text-yellow-400 transition-all duration-300 ${
                  isScrolled ? 'text-xl xl:text-2xl' : 'text-2xl xl:text-3xl'
                }`}>
                  DELICE <span className="font-thin italic text-yellow-400">WAND</span>
                </h1>
              </button>
            </div>

            {/* Navigation desktop à droite du logo */}
            <nav className="hidden xl:flex items-center space-x-6 ml-12">
              <button 
                onClick={() => setActivePage('restaurant')}
                className={`px-4 py-3 text-sm font-light tracking-wide transition-all duration-300 relative rounded-lg hover:bg-white/10 ${
                  activePage === 'restaurant' ? 'text-yellow-400 bg-yellow-400/10' : 'text-gray-300 hover:text-white'
                }`}
              >
                Restaurant
                {activePage === 'restaurant' && (
                  <div className="absolute -bottom-1 left-2 right-2 h-0.5 bg-yellow-400 rounded-full" />
                )}
              </button>
              <button 
                onClick={() => setActivePage('carte')}
                className={`px-4 py-3 text-sm font-light tracking-wide transition-all duration-300 relative rounded-lg hover:bg-white/10 ${
                  activePage === 'carte' ? 'text-yellow-400 bg-yellow-400/10' : 'text-gray-300 hover:text-white'
                }`}
              >
                Carte
                {activePage === 'carte' && (
                  <div className="absolute -bottom-1 left-2 right-2 h-0.5 bg-yellow-400 rounded-full" />
                )}
              </button>
              <button 
                onClick={() => setActivePage('localisation')}
                className={`px-4 py-3 text-sm font-light tracking-wide transition-all duration-300 relative rounded-lg hover:bg-white/10 ${
                  activePage === 'localisation' ? 'text-yellow-400 bg-yellow-400/10' : 'text-gray-300 hover:text-white'
                }`}
              >
                Localisation
                {activePage === 'localisation' && (
                  <div className="absolute -bottom-1 left-2 right-2 h-0.5 bg-yellow-400 rounded-full" />
                )}
              </button>
              <button 
                onClick={() => setActivePage('rejoindre')}
                className={`px-4 py-3 text-sm font-light tracking-wide transition-all duration-300 relative rounded-lg hover:bg-white/10 ${
                  activePage === 'rejoindre' ? 'text-yellow-400 bg-yellow-400/10' : 'text-gray-300 hover:text-white'
                }`}
              >
                Contact
                {activePage === 'rejoindre' && (
                  <div className="absolute -bottom-1 left-2 right-2 h-0.5 bg-yellow-400 rounded-full" />
                )}
              </button>
            </nav>

            {/* Bouton Commander agrandi - Complètement à droite */}
            <div className="flex items-center ml-auto space-x-4">
              {/* Menu hamburger - Mobile */}
              <button 
                onClick={toggleMobileMenu}
                className="xl:hidden text-white p-3 focus:outline-none hover:text-yellow-400 hover:bg-white/10 rounded-xl transition-all duration-300"
                aria-label="Menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              </button>

              {/* Bouton Commander - Desktop */}
              <Link href="/Commande">
                <button className={`hidden xl:block bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold tracking-wider uppercase hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 rounded-2xl shadow-xl hover:shadow-yellow-400/30 transform hover:scale-105 ${
                  isScrolled ? 'px-10 py-3 text-sm' : 'px-12 py-4 text-base'
                }`}>
                  Commander Maintenant
                </button>
              </Link>
            </div>
          </div>

          {/* Menu mobile stylé - même style que desktop */}
          <div className={`xl:hidden transition-all duration-300 ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
            {/* Overlay pour fermer le menu */}
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setIsMobileMenuOpen(false)}
            ></div>
            
            {/* Menu mobile subtil */}
            <div className={`relative z-50 ${
              isScrolled 
                ? 'bg-gradient-to-r from-black/85 via-gray-900/90 to-black/85 backdrop-blur-xl border-b border-white/20' 
                : 'bg-gradient-to-r from-black/80 via-gray-900/90 to-black/80 backdrop-blur-xl border-b border-white/20'
            } mx-4 mt-2 rounded-2xl shadow-2xl border transition-all duration-300`}>
              
              <div className="p-6 space-y-3">

                <button 
                  onClick={() => {
                    setActivePage('home'); 
                    setIsMobileMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`block w-full text-left px-4 py-3 text-sm font-light tracking-wide transition-all duration-300 rounded-lg hover:bg-white/10 ${
                    activePage === 'home' ? 'text-yellow-400 bg-yellow-400/10' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  Accueil
                  {activePage === 'home' && (
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-yellow-400 rounded-full"></div>
                  )}
                </button>
                <button 
                  onClick={() => {setActivePage('restaurant'); setIsMobileMenuOpen(false);}}
                  className={`block w-full text-left px-4 py-3 text-sm font-light tracking-wide transition-all duration-300 rounded-lg hover:bg-white/10 relative ${
                    activePage === 'restaurant' ? 'text-yellow-400 bg-yellow-400/10' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  Restaurant
                  {activePage === 'restaurant' && (
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-yellow-400 rounded-full"></div>
                  )}
                </button>
                <button 
                  onClick={() => {setActivePage('carte'); setIsMobileMenuOpen(false);}}
                  className={`block w-full text-left px-4 py-3 text-sm font-light tracking-wide transition-all duration-300 rounded-lg hover:bg-white/10 relative ${
                    activePage === 'carte' ? 'text-yellow-400 bg-yellow-400/10' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  Carte
                  {activePage === 'carte' && (
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-yellow-400 rounded-full"></div>
                  )}
                </button>
                <button 
                  onClick={() => {setActivePage('localisation'); setIsMobileMenuOpen(false);}}
                  className={`block w-full text-left px-4 py-3 text-sm font-light tracking-wide transition-all duration-300 rounded-lg hover:bg-white/10 relative ${
                    activePage === 'localisation' ? 'text-yellow-400 bg-yellow-400/10' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  Localisation
                  {activePage === 'localisation' && (
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-yellow-400 rounded-full"></div>
                  )}
                </button>
                <button 
                  onClick={() => {setActivePage('rejoindre'); setIsMobileMenuOpen(false);}}
                  className={`block w-full text-left px-4 py-3 text-sm font-light tracking-wide transition-all duration-300 rounded-lg hover:bg-white/10 relative ${
                    activePage === 'rejoindre' ? 'text-yellow-400 bg-yellow-400/10' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  Contact
                  {activePage === 'rejoindre' && (
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-yellow-400 rounded-full"></div>
                  )}
                </button>
                
                {/* Séparateur avec même style que desktop */}
                <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent my-4"></div>
                
                {/* Bouton Commander - Mobile */}
                <Link href="/Commande">
                  <button className="w-full px-6 py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold tracking-wider uppercase hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 rounded-xl shadow-lg hover:shadow-yellow-400/25 transform hover:scale-[1.02]">
                    Commander Maintenant
                  </button>
                </Link>
              </div>
            </div>
          </div>
      </header>

      {/* Arrière-plan fixe sur tout l'écran */}
      <div className="fixed inset-0 w-full h-full">

        {/* Image d'arrière-plan principale */}
        <div className="absolute inset-0 z-10 overflow-hidden">
          <div 
            className="absolute w-full h-full parallax-bg"
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
        {/* Espace pour le header - adaptatif */}
        <div className={`flex-shrink-0 transition-all duration-300 ${isScrolled ? 'h-18' : 'h-20'}`}></div>
        {activePage === 'home' && (
          <div className="flex flex-col w-full h-full">
            {/* Hero Section - Design minimal et sobre */}
            <section data-section="hero" className="w-full h-[75vh] md:h-[70vh] flex items-center justify-center px-6 relative">
              <div className="max-w-5xl w-full text-center">
                {/* Titre principal épuré */}
                <h1 className="text-6xl sm:text-8xl lg:text-9xl font-light text-white mb-4 tracking-tight leading-none tracking-in-expand-fwd">
                  Delice
                  <span className=" text-yellow-400 font-thin italic">Wand</span>

                </h1>
                
                {/* Sous-titre minimaliste */}
                <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl mx-auto font-light leading-relaxed tracking-wide slide-in-left" style={{ animationDelay: '0.3s' }}>
                  L&apos;art culinaire à l&apos;état pur.<br />
                  Saveurs authentiques, expérience inoubliable.
                </p>
                
                {/* Boutons d'action épurés */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Link href="/Commande">
                    <button className="group px-8 py-4 bg-white text-black font-medium tracking-wider uppercase transition-all duration-300 relative overflow-hidden slide-in-left">
                      <span className="relative z-10">Commander</span>
                      <div className="absolute inset-0 bg-yellow-400 transform translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                    </button>
                  </Link>
                  
                  <button 
                    onClick={() => setActivePage('carte')}
                    className="px-8 py-4 border border-white/30 text-white font-medium tracking-wider uppercase hover:border-yellow-400 hover:text-yellow-400 transition-all duration-300 slide-in-right"
                  >
                    Notre Carte
                  </button>
                </div>
              </div>
              

            </section>

            {/* Section Stats - Layout minimaliste */}
            <section data-section="stats" className="w-full pb-26 px-6">
              <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                  <div className="group" data-animate="fade-in-up">
                    <div className="text-5xl text-yellow-400 mb-2 font-light">50+</div>
                    <h3 className="text-xl text-white font-light tracking-wide">Créations Uniques</h3>
                    <div className="w-16 h-px bg-gray-600 mx-auto mt-2 group-hover:bg-yellow-400 transition-colors duration-300"></div>
                  </div>
                  
                  <div className="group" data-animate="fade-in-up">
                    <div className="text-5xl text-yellow-400 mb-2 font-light">4.8</div>
                    <h3 className="text-xl text-white font-light tracking-wide">Excellence Reconnue</h3>
                    <div className="w-16 h-px bg-gray-600 mx-auto mt-2 group-hover:bg-yellow-400 transition-colors duration-300"></div>
                  </div>
                  
                  <div className="group" data-animate="fade-in-up">
                    <div className="text-5xl text-yellow-400 mb-2 font-light">15min</div>
                    <h3 className="text-xl text-white font-light tracking-wide">Service Express</h3>
                    <div className="w-16 h-px bg-gray-600 mx-auto mt-2 group-hover:bg-yellow-400 transition-colors duration-300"></div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section Philosophie - Design épuré */}
            <section data-section="philosophy" className="w-full py-16 px-6 border-t border-gray-800">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-4xl lg:text-5xl font-light text-white mb-8 tracking-tight" data-animate="slide-in-bottom">
                  Notre <span className="text-yellow-400 italic">Philosophie</span>
                </h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                  <div className="text-center" data-animate="scale-in">
                    <h3 className="text-xl text-white mb-3 font-light">Qualité</h3>
                    <p className="text-gray-400 leading-relaxed font-light">
                      Ingrédients sélectionnés avec passion, techniques artisanales préservées.
                    </p>
                  </div>
                  
                  <div className="text-center" data-animate="scale-in">
                    <h3 className="text-xl text-white mb-3 font-light">Fraîcheur</h3>
                    <p className="text-gray-400 leading-relaxed font-light">
                      Produits locaux et de saison, préparés quotidiennement dans nos cuisines.
                    </p>
                  </div>
                  
                  <div className="text-center" data-animate="scale-in">
                    <h3 className="text-xl text-white mb-3 font-light">Innovation</h3>
                    <p className="text-gray-400 leading-relaxed font-light">
                      Créativité culinaire et respect des traditions, pour une expérience unique.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Call to Action final - Minimaliste */}
            <section data-section="cta" className="w-full py-24 px-6 border-t border-gray-800">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl lg:text-4xl font-light text-white mb-8 tracking-tight" data-animate="slide-in-bottom">
                  Prêt à découvrir ?
                </h2>
                <p className="text-gray-400 mb-12 text-lg font-light leading-relaxed" data-animate="fade-in-up">
                  Rejoignez-nous pour une expérience gastronomique mémorable.
                </p>
                <Link href="/Commande">
                  <button className="group px-12 py-5 bg-yellow-400 text-black font-medium tracking-wider uppercase hover:bg-white transition-all duration-300 text-lg bounce-in-hover pulse-glow" data-animate="scale-in">
                    Commencer l&apos;expérience
                  </button>
                </Link>
              </div>
            </section>
          </div>
        )   }
        
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
              <h2 className="text-4xl font-bold text-white mb-3 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">NOTRE MENU</h2>
              <div className="h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mx-auto" style={{ width: '300px' }}></div>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed mt-6">
                Découvrez nos délicieuses spécialités directement depuis notre base de données
              </p>

              {loading ? (
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
                  <p className="text-white mt-4">Chargement du menu...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categories.map((category) => (
                    <div key={category._id} className="group bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md rounded-2xl p-6 border border-gray-600/50 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105">
                      <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                        <span className="text-2xl">🏷️</span>
                      </div>
                      <h4 className="text-xl font-bold text-white mb-3 text-center">{category.name}</h4>
                      <p className="text-gray-300 text-center mb-4">{category.description}</p>
                      <div className="text-center">
                        <span className="text-yellow-400 font-semibold">
                          {getProductsByCategory(category.name).length} produits
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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

              {/* Test MongoDB */}
              <div className="mb-8">
                <div className="inline-block bg-gradient-to-br from-gray-700/60 to-gray-800/60 rounded-lg p-4 border border-gray-600/30 shadow-md mb-6">
                  <h3 className="text-2xl font-bold text-white mb-0 flex items-center">
                    <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-3 text-white text-sm font-bold">🗄️</span>
                    Test MongoDB Atlas
                  </h3>
                </div>
                <div className="bg-white/10 rounded-xl p-6 border border-white/20">
                  <div className="text-white">
                    <h4 className="text-xl font-bold mb-4">Test MongoDB Atlas</h4>
                    <p>Cette section devrait être visible maintenant.</p>
                    <p>Si vous voyez ce texte, le composant MongoDBTest fonctionne.</p>
                    <MongoDBTest />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Flèche chevron fixe en bas de l'écran */}
      {activePage === 'home' && (
        <div 
          onClick={() => {
            const statsSection = document.querySelector('[data-section="stats"]');
            if (statsSection) {
              statsSection.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 cursor-pointer p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-yellow-400/20 hover:border-yellow-400/50 transition-all duration-300 group"
        >
          <svg 
            className="w-6 h-6 text-white group-hover:text-yellow-400 transform group-hover:translate-y-1 transition-all duration-300 animate-bounce" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            strokeWidth="1.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      )}

      {/* Espace en bas pour s'assurer que tout le contenu soit visible */}
      <div className="h-20"></div>
    </div>
  );
}
