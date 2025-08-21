"use client";
import Image from "next/image";
import Link from "next/link";

import { useState, useEffect } from "react";
import MongoDBTest from "./components/MongoDBTest";
import "./fonts.css";

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

    // Animation automatique quand la page active change
  useEffect(() => {
    // Remettre le scroll en haut à chaque changement de page
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Réinitialiser toutes les animations
    const resetAnimations = () => {
      document.querySelectorAll('[data-animate]').forEach((el) => {
        el.classList.remove('animate-in');
      });
    };

    // Réinitialiser d'abord
    resetAnimations();

    // Attendre que le DOM soit mis à jour
    setTimeout(() => {
      if (activePage === 'restaurant') {
        // Observer seulement les éléments visibles dans le viewport
        const observerOptions = {
          threshold: 0.1,
          rootMargin: '0px 0px -50px 0px' // Déclenche un peu avant que l'élément soit complètement visible
        };

        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Ajouter un délai progressif basé sur l'index de l'élément
              const animatedElements = document.querySelectorAll('[data-animate]');
              const index = Array.from(animatedElements).indexOf(entry.target);
              const delay = index * 0.1;
              
              setTimeout(() => {
                entry.target.classList.add('animate-in');
              }, delay * 1000);
            }
          });
        }, observerOptions);

        // Observer tous les éléments avec data-animate
        document.querySelectorAll('[data-animate]').forEach((el) => {
          observer.observe(el);
        });

        // Retourner la fonction de nettoyage
        return () => observer.disconnect();
      } else if (activePage === 'reservation') {
        // Observer seulement les éléments visibles dans le viewport
        const observerOptions = {
          threshold: 0.1,
          rootMargin: '0px 0px -50px 0px' // Déclenche un peu avant que l'élément soit complètement visible
        };

        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Ajouter un délai progressif basé sur l'index de l'élément
              const animatedElements = document.querySelectorAll('[data-animate]');
              const index = Array.from(animatedElements).indexOf(entry.target);
              const delay = index * 0.1;
              
              setTimeout(() => {
                entry.target.classList.add('animate-in');
              }, delay * 1000);
            }
          });
        }, observerOptions);

        // Observer tous les éléments avec data-animate
        document.querySelectorAll('[data-animate]').forEach((el) => {
          observer.observe(el);
        });

        // Retourner la fonction de nettoyage
        return () => observer.disconnect();
      } else if (activePage === 'localisation') {
        // Observer seulement les éléments visibles dans le viewport
        const observerOptions = {
          threshold: 0.1,
          rootMargin: '0px 0px -50px 0px' // Déclenche un peu avant que l'élément soit complètement visible
        };

        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Ajouter un délai progressif basé sur l'index de l'élément
              const animatedElements = document.querySelectorAll('[data-animate]');
              const index = Array.from(animatedElements).indexOf(entry.target);
              const delay = index * 0.1;
              
              setTimeout(() => {
                entry.target.classList.add('animate-in');
              }, delay * 1000);
            }
          });
        }, observerOptions);

        // Observer tous les éléments avec data-animate
        document.querySelectorAll('[data-animate]').forEach((el) => {
          observer.observe(el);
        });

        // Retourner la fonction de nettoyage
        return () => observer.disconnect();
      } else if (activePage === 'rejoindre') {
        // Observer seulement les éléments visibles dans le viewport
        const observerOptions = {
          threshold: 0.1,
          rootMargin: '0px 0px -50px 0px' // Déclenche un peu avant que l'élément soit complètement visible
        };

        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Ajouter un délai progressif basé sur l'index de l'élément
              const animatedElements = document.querySelectorAll('[data-animate]');
              const index = Array.from(animatedElements).indexOf(entry.target);
              const delay = index * 0.1;
              
              setTimeout(() => {
                entry.target.classList.add('animate-in');
              }, delay * 1000);
            }
          });
        }, observerOptions);

        // Observer tous les éléments avec data-animate
        document.querySelectorAll('[data-animate]').forEach((el) => {
          observer.observe(el);
        });

        // Retourner la fonction de nettoyage
        return () => observer.disconnect();
      }
      // Ajouter d'autres pages ici si nécessaire
    }, 100);
  }, [activePage]);

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
                  Bokh<span className="font-thin italic text-yellow-400">eat</span>
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
                onClick={() => setActivePage('reservation')}
                className={`px-4 py-3 text-sm font-light tracking-wide transition-all duration-300 relative rounded-lg hover:bg-white/10 ${
                  activePage === 'reservation' ? 'text-yellow-400 bg-yellow-400/10' : 'text-gray-300 hover:text-white'
                }`}
              >
                Réservation
                {activePage === 'reservation' && (
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
                <button className={`hidden xl:block bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-light tracking-wider uppercase hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 rounded-2xl shadow-xl hover:shadow-yellow-400/30 transform hover:scale-105 capture-it-font border-2 border-yellow-600 hover:border-yellow-700 hover:shadow-yellow-400/50 ${
                  isScrolled ? 'px-8 py-2 text-sm' : 'px-10 py-3 text-base'
                }`}>
                  <span className="relative z-10 flex items-center">
                    <span className="font-light capture-it-font text-lg tracking-wider whitespace-nowrap">Commander Maintenant</span>
                  </span>
                </button>
              </Link>
            </div>
          </div>

          {/* Menu mobile moderne et élégant */}
          <div className={`xl:hidden transition-all duration-500 ease-out ${isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
            {/* Overlay élégant avec animation */}
            <div 
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-40 transition-opacity duration-500"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Menu mobile avec design moderne - collé au header */}
            <div className={`absolute top-full left-0 right-0 z-50 transform transition-all duration-500 ease-out ${
              isMobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
            }`}>
              
                {/* Container principal avec style grisâtre similaire au header */}
                <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-white/20 shadow-2xl">
              
                <div className="p-4 space-y-2">
                  <button 
                    onClick={() => {
                      setActivePage('home'); 
                      setIsMobileMenuOpen(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`w-full group relative overflow-hidden rounded-xl transition-all duration-300 ${
                      activePage === 'home' 
                        ? 'bg-yellow-400/15 border border-yellow-400/40' 
                        : 'hover:bg-white/5 border border-transparent hover:border-white/20'
                    }`}
                  >
                    <div className="px-6 py-4 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                          activePage === 'home' 
                            ? 'bg-yellow-400 text-black' 
                            : 'bg-white/15 text-white group-hover:bg-white/25'
                        }`}>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                        </div>
                        <span className={`font-medium transition-all duration-300 ${
                          activePage === 'home' ? 'text-yellow-400' : 'text-gray-200'
                        }`}>
                          Accueil
                        </span>
                      </div>
                      {activePage === 'home' && (
                        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                      )}
                    </div>
                  </button>

                  <button 
                    onClick={() => {setActivePage('restaurant'); setIsMobileMenuOpen(false);}}
                    className={`w-full group relative overflow-hidden rounded-xl transition-all duration-300 ${
                      activePage === 'restaurant' 
                        ? 'bg-yellow-400/15 border border-yellow-400/40' 
                        : 'hover:bg-white/5 border border-transparent hover:border-white/20'
                    }`}
                  >
                    <div className="px-6 py-4 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                          activePage === 'restaurant' 
                            ? 'bg-yellow-400 text-black' 
                            : 'bg-white/15 text-white group-hover:bg-white/25'
                        }`}>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <span className={`font-medium transition-all duration-300 ${
                          activePage === 'restaurant' ? 'text-yellow-400' : 'text-gray-200'
                        }`}>
                          Restaurant
                        </span>
                      </div>
                      {activePage === 'restaurant' && (
                        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                      )}
                    </div>
                  </button>

                  <button 
                    onClick={() => {setActivePage('reservation'); setIsMobileMenuOpen(false);}}
                    className={`w-full group relative overflow-hidden rounded-xl transition-all duration-300 ${
                      activePage === 'reservation' 
                        ? 'bg-yellow-400/15 border border-yellow-400/40' 
                        : 'hover:bg-white/5 border border-transparent hover:border-white/20'
                    }`}
                  >
                    <div className="px-6 py-4 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                          activePage === 'reservation' 
                            ? 'bg-yellow-400 text-black' 
                            : 'bg-white/15 text-white group-hover:bg-white/25'
                        }`}>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0l-6 6m6-6l6 6m-6 0v6a2 2 0 01-2 2H8a2 2 0 01-2-2v-6m6 0H8" />
                          </svg>
                        </div>
                        <span className={`font-medium transition-all duration-300 ${
                          activePage === 'reservation' ? 'text-yellow-400' : 'text-gray-200'
                        }`}>
                          Réservation
                        </span>
                      </div>
                      {activePage === 'reservation' && (
                        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                      )}
                    </div>
                  </button>

                  

                  <button 
                    onClick={() => {setActivePage('localisation'); setIsMobileMenuOpen(false);}}
                    className={`w-full group relative overflow-hidden rounded-xl transition-all duration-300 ${
                      activePage === 'localisation' 
                        ? 'bg-yellow-400/15 border border-yellow-400/40' 
                        : 'hover:bg-white/5 border border-transparent hover:border-white/20'
                    }`}
                  >
                    <div className="px-6 py-4 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                          activePage === 'localisation' 
                            ? 'bg-yellow-400 text-black' 
                            : 'bg-white/15 text-white group-hover:bg-white/25'
                        }`}>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <span className={`font-medium transition-all duration-300 ${
                          activePage === 'localisation' ? 'text-yellow-400' : 'text-gray-200'
                        }`}>
                          Localisation
                        </span>
                      </div>
                      {activePage === 'localisation' && (
                        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                      )}
                    </div>
                  </button>

                  <button 
                    onClick={() => {setActivePage('rejoindre'); setIsMobileMenuOpen(false);}}
                    className={`w-full group relative overflow-hidden rounded-xl transition-all duration-300 ${
                      activePage === 'rejoindre' 
                        ? 'bg-yellow-400/15 border border-yellow-400/40' 
                        : 'hover:bg-white/5 border border-transparent hover:border-white/20'
                    }`}
                  >
                    <div className="px-6 py-4 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                          activePage === 'rejoindre' 
                            ? 'bg-yellow-400 text-black' 
                            : 'bg-white/15 text-white group-hover:bg-white/25'
                        }`}>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        </div>
                        <span className={`font-medium transition-all duration-300 ${
                          activePage === 'rejoindre' ? 'text-yellow-400' : 'text-gray-200'
                        }`}>
                          Contact
                        </span>
                      </div>
                      {activePage === 'rejoindre' && (
                        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                      )}
                    </div>
                  </button>
                </div>
                
                {/* Footer avec bouton Commander */}
                <div className="px-4 py-4 border-t border-white/20 bg-gradient-to-r from-transparent to-white/5">
                  <Link href="/Commande">
                    <button className="w-full group relative overflow-hidden bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-light tracking-wider uppercase transition-all duration-300 rounded-xl shadow-lg hover:shadow-yellow-400/25 transform hover:scale-[1.02] py-4 capture-it-font border-2 border-yellow-600 hover:border-yellow-700 hover:shadow-yellow-400/50">
                      <span className="relative z-10 flex items-center justify-center">
                        <span className="font-light capture-it-font text-lg tracking-wider whitespace-nowrap">Commander Maintenant</span>
                      </span>
                      <div className="absolute inset-0 bg-white transform translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                    </button>
                  </Link>
                </div>
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
                <h1 className="text-6xl sm:text-8xl lg:text-9xl font-light text-white mb-4 tracking-tight leading-none tracking-in-expand-fwd capture-it-font">
                  Bokh
                  <span className=" text-yellow-400 font-thin italic">eat</span>

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
                    onClick={() => setActivePage('reservation')}
                    className="px-8 py-4 border border-white/30 text-white font-medium tracking-wider uppercase hover:border-yellow-400 hover:text-yellow-400 transition-all duration-300 slide-in-right"
                  >
                    Réserver Maintenant
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
                <h2 className="text-4xl lg:text-5xl font-light text-white mb-8 tracking-tight capture-it-font" data-animate="slide-in-bottom">
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
                <h2 className="text-3xl lg:text-4xl font-light text-white mb-8 tracking-tight capture-it-font" data-animate="slide-in-bottom">
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
          <div className="flex-1 w-full pt-8 px-4">
            {/* Layout en grille asymétrique moderne */}
            <div className="max-w-7xl mx-auto">
              
              {/* Section Hero avec image de fond */}
              <div className="relative h-64 sm:h-80 md:h-96 rounded-2xl sm:rounded-3xl overflow-hidden mb-8 sm:mb-12 md:mb-16 group" data-animate="fade-in-up">
                <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div className="relative z-10 h-full flex items-end p-4 sm:p-6 md:p-8 lg:p-12">
                  <div className="text-white">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-thin mb-2 sm:mb-3 md:mb-4 tracking-wider capture-it-font">
                      Bokh<span className="text-yellow-400 italic">eat</span>
                    </h1>
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-200 max-w-2xl leading-relaxed">
                      Une expérience culinaire unique où tradition et modernité se rencontrent pour créer des moments inoubliables.
                    </p>
                  </div>
                </div>
                {/* Éléments décoratifs flottants */}
                <div className="absolute top-4 sm:top-6 md:top-8 right-4 sm:right-6 md:right-8 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-yellow-400/20 rounded-full blur-xl group-hover:bg-yellow-400/30 transition-all duration-700"></div>
                <div className="absolute bottom-8 sm:bottom-12 md:bottom-16 left-6 sm:left-8 md:left-12 w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-blue-400/20 rounded-full blur-xl group-hover:bg-blue-400/30 transition-all duration-700"></div>
              </div>

              {/* Grille principale avec sections alternées */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
                
                {/* Section Histoire - Large */}
                <div className="lg:col-span-8" data-animate="slide-in-left">
                  <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-600/30 hover:border-yellow-400/50 transition-all duration-500 group">
                    <div className="flex items-center mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform duration-300">
                        <span className="text-3xl">🏛️</span>
                      </div>
                      <div>
                        <h2 className="text-3xl font-light text-white mb-2 capture-it-font">Notre Histoire</h2>
                        <div className="w-20 h-0.5 bg-yellow-400 rounded-full"></div>
                      </div>
                    </div>
                    <p className="text-lg text-gray-300 leading-relaxed mb-6">
                      Depuis notre création, nous nous efforçons de créer une expérience culinaire unique. 
                      Chaque plat raconte une histoire, chaque saveur évoque une émotion. 
                      Notre passion pour la gastronomie se reflète dans chaque détail.
                    </p>
                    <div className="flex space-x-4">
                      <div className="flex-1 bg-gray-700/50 rounded-xl p-4 text-center group hover:bg-gray-700/70 transition-all duration-300 hover:scale-105">
                        <div className="text-2xl font-bold text-yellow-400 mb-1 group-hover:text-yellow-300 transition-colors duration-300">15+</div>
                        <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">Années d&apos;expérience</div>
                      </div>
                      <div className="flex-1 bg-gray-700/50 rounded-xl p-4 text-center group hover:bg-gray-700/70 transition-all duration-300 hover:scale-105">
                        <div className="text-2xl font-bold text-yellow-400 mb-1 group-hover:text-yellow-300 transition-colors duration-300">50k+</div>
                        <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">Clients satisfaits</div>
                      </div>
                      <div className="flex-1 bg-gray-700/50 rounded-xl p-4 text-center group hover:bg-gray-700/70 transition-all duration-300 hover:scale-105">
                        <div className="text-2xl font-bold text-yellow-400 mb-1 group-hover:text-yellow-300 transition-colors duration-300">100+</div>
                        <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">Plats créés</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section Équipe - Étroite */}
                <div className="lg:col-span-4" data-animate="slide-in-right">
                  <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-600/30 h-full flex flex-col justify-center">
                    <div className="text-center mb-6">
                      <div className="w-20 h-20 bg-gray-400/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-4xl">👨‍🍳</span>
                      </div>
                      <h3 className="text-2xl font-light text-white mb-2">Notre Équipe</h3>
                      <div className="w-16 h-0.5 bg-gray-400 rounded-full mx-auto"></div>
                    </div>
                    <p className="text-gray-300 text-center leading-relaxed">
                      Des passionnés qui créent chaque jour des expériences culinaires exceptionnelles.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section Catégories Culinaires */}
              <div className="mb-16" data-animate="fade-in-up">
                <div className="text-center mb-12" data-animate="slide-in-bottom">
                  <h2 className="text-4xl font-light text-white mb-4 capture-it-font">Catégories Culinaires</h2>
                  <div className="w-32 h-0.5 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full mx-auto"></div>
                  <p className="text-xl text-gray-300 mt-6 max-w-2xl mx-auto leading-relaxed">
                    Explorez nos différentes catégories et découvrez des saveurs uniques
                  </p>
                </div>
                
                {loading ? (
                  <div className="text-center" data-animate="fade-in-up">
                    <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-400"></div>
                    <p className="text-white mt-6 text-lg">Chargement du menu...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {categories.map((category, index) => (
                      <div 
                        key={category._id} 
                        className="group relative" 
                        data-animate="scale-in"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-600/30 hover:border-yellow-400/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-400/25 h-full">
                          <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                            <span className="text-3xl">🏷️</span>
                          </div>
                          <h4 className="text-2xl font-medium text-white mb-4 text-center group-hover:text-yellow-400 transition-colors duration-300">
                            {category.name}
                          </h4>
                          <p className="text-gray-300 text-center mb-6 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                            {category.description}
                          </p>
                          <div className="text-center">
                            <div className="inline-flex items-center space-x-2 bg-yellow-400/20 rounded-full px-4 py-2 group-hover:bg-yellow-400/30 transition-all duration-300">
                              <span className="text-yellow-400 font-semibold text-lg">
                                {getProductsByCategory(category.name).length}
                              </span>
                              <span className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-300">
                                produits
                              </span>
                            </div>
                          </div>
                        </div>
                        {/* Élément décoratif */}
                        <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Section Call-to-Action finale */}
              <div className="text-center" data-animate="slide-in-bottom">
                <div className="bg-gradient-to-r from-yellow-400/10 via-orange-500/10 to-red-500/10 backdrop-blur-xl rounded-3xl p-12 border border-yellow-400/20">
                  <h2 className="text-4xl font-light text-white mb-6">Prêt à nous rejoindre ?</h2>
                  <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                    Découvrez l&apos;art culinaire à son meilleur et faites partie de notre aventure gastronomique.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-medium py-4 px-8 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-400/25">
                      Commander maintenant
                    </button>
                    <button className="border-2 border-yellow-400/50 hover:border-yellow-400 text-yellow-400 hover:text-white hover:bg-yellow-400 font-medium py-4 px-8 rounded-2xl transition-all duration-300 hover:scale-105">
                      En savoir plus
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activePage === 'reservation' && (
          <div className="flex-1 w-full pt-8 px-4">
            {/* Layout en grille asymétrique moderne */}
            <div className="max-w-7xl mx-auto">
              
              {/* Section Hero avec image de fond */}
              <div className="relative h-64 sm:h-80 md:h-96 rounded-2xl sm:rounded-3xl overflow-hidden mb-8 sm:mb-12 md:mb-16 group" data-animate="fade-in-up">
                <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div className="relative z-10 h-full flex items-end p-4 sm:p-6 md:p-8 lg:p-12">
                  <div className="text-white">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-thin mb-2 sm:mb-3 md:mb-4 tracking-wider capture-it-font">
                      Réserver une <span className="text-yellow-400 italic">Table</span>
                    </h1>
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-200 max-w-2xl leading-relaxed">
                      Créez des moments inoubliables en réservant votre table chez Bokheat. 
                      Une expérience gastronomique personnalisée vous attend.
                    </p>
                  </div>
                </div>
                {/* Éléments décoratifs flottants */}
                <div className="absolute top-4 sm:top-6 md:top-8 right-4 sm:right-6 md:right-8 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-yellow-400/20 rounded-full blur-xl group-hover:bg-yellow-400/30 transition-all duration-700"></div>
                <div className="absolute bottom-8 sm:bottom-12 md:bottom-16 left-6 sm:left-8 md:left-12 w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-green-400/20 rounded-full blur-xl group-hover:bg-green-400/30 transition-all duration-700"></div>
              </div>

              {/* Grille principale avec sections alternées */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
                
                {/* Section Formulaire de Réservation - Large */}
                <div className="lg:col-span-8" data-animate="slide-in-left">
                  <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-600/30 hover:border-yellow-400/50 transition-all duration-500 group">
                    <div className="flex items-center mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform duration-300">
                        <span className="text-3xl">📅</span>
                      </div>
                      <div>
                        <h2 className="text-3xl font-light text-white mb-2">Formulaire de Réservation</h2>
                        <div className="w-20 h-0.5 bg-yellow-400 rounded-full"></div>
                      </div>
                    </div>
                    
                    <form className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-white text-sm font-medium mb-2">Nom complet</label>
                          <input 
                            type="text" 
                            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400/50 focus:bg-gray-700/70 transition-all duration-300"
                            placeholder="Votre nom complet"
                          />
                        </div>
                        <div>
                          <label className="block text-white text-sm font-medium mb-2">Téléphone</label>
                          <input 
                            type="tel" 
                            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400/50 focus:bg-gray-700/70 transition-all duration-300"
                            placeholder="Votre numéro"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-white text-sm font-medium mb-2">Date</label>
                          <input 
                            type="date" 
                            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/30 rounded-xl text-white focus:outline-none focus:border-yellow-400/50 focus:bg-gray-700/70 transition-all duration-300"
                          />
                        </div>
                        <div>
                          <label className="block text-white text-sm font-medium mb-2">Heure</label>
                          <select className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/30 rounded-xl text-white focus:outline-none focus:border-yellow-400/50 focus:bg-gray-700/70 transition-all duration-300">
                            <option value="">Sélectionnez une heure</option>
                            <option value="11:00">11:00</option>
                            <option value="11:30">11:30</option>
                            <option value="12:00">12:00</option>
                            <option value="12:30">12:30</option>
                            <option value="13:00">13:00</option>
                            <option value="13:30">13:30</option>
                            <option value="17:30">17:30</option>
                            <option value="18:00">18:00</option>
                            <option value="18:30">18:30</option>
                            <option value="19:00">19:00</option>
                            <option value="19:30">19:30</option>
                            <option value="20:00">20:00</option>
                            <option value="20:30">20:30</option>
                            <option value="21:00">21:00</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-white text-sm font-medium mb-2">Nombre de personnes</label>
                          <select className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/30 rounded-xl text-white focus:outline-none focus:border-yellow-400/50 focus:bg-gray-700/70 transition-all duration-300">
                            <option value="">Sélectionnez</option>
                            <option value="1">1 personne</option>
                            <option value="2">2 personnes</option>
                            <option value="3">3 personnes</option>
                            <option value="4">4 personnes</option>
                            <option value="5">5 personnes</option>
                            <option value="6">6 personnes</option>
                            <option value="7+">7+ personnes</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-white text-sm font-medium mb-2">Type d&apos;événement</label>
                          <select className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/30 rounded-xl text-white focus:outline-none focus:border-yellow-400/50 focus:bg-gray-700/70 transition-all duration-300">
                            <option value="">Sélectionnez</option>
                            <option value="diner-romantique">Dîner romantique</option>
                            <option value="anniversaire">Anniversaire</option>
                            <option value="reunion-famille">Réunion de famille</option>
                            <option value="soiree-entreprises">Soirée entreprises</option>
                            <option value="autre">Autre</option>
                          </select>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-white text-sm font-medium mb-2">Demandes spéciales</label>
                        <textarea 
                          rows={4}
                          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400/50 focus:bg-gray-700/70 transition-all duration-300"
                          placeholder="Allergies, préférences, demandes particulières..."
                        />
                      </div>
                      
                      <button 
                        type="submit"
                        className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-medium py-4 px-8 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-400/25"
                      >
                        Confirmer la réservation
                      </button>
                    </form>
                  </div>
                </div>

                {/* Section Informations - Étroite */}
                <div className="lg:col-span-4" data-animate="slide-in-right">
                  <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-600/30 h-full flex flex-col justify-center">
                    <div className="text-center mb-6">
                      <div className="w-20 h-20 bg-gray-400/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-4xl">ℹ️</span>
                      </div>
                      <h3 className="text-2xl font-light text-white mb-2">Informations Utiles</h3>
                      <div className="w-16 h-0.5 bg-gray-400 rounded-full mx-auto"></div>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                        <h4 className="text-lg font-medium text-white mb-3">📞 Réservation par téléphone</h4>
                        <p className="text-gray-300 text-sm">Appelez-nous directement au 02 468 12 76</p>
                      </div>
                      <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                        <h4 className="text-lg font-medium text-white mb-3">⏰ Délai de confirmation</h4>
                        <p className="text-gray-300 text-sm">Nous confirmons sous 2 heures</p>
                      </div>
                      <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                        <h4 className="text-lg font-medium text-white mb-3">🎉 Événements spéciaux</h4>
                        <p className="text-gray-300 text-sm">Contactez-nous pour les groupes de 8+ personnes</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section Avantages en grille */}
              <div className="mb-16" data-animate="fade-in-up">
                <div className="text-center mb-12" data-animate="slide-in-bottom">
                  <h2 className="text-4xl font-light text-white mb-4 capture-it-font">Pourquoi Réserver ?</h2>
                  <div className="w-32 h-0.5 bg-gradient-to-r from-yellow-400 via-green-500 to-blue-500 rounded-full mx-auto"></div>
                  <p className="text-xl text-gray-300 mt-6 max-w-2xl mx-auto leading-relaxed">
                    Découvrez tous les avantages de réserver votre table chez Bokheat
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Avantage 1 - Garantie de place */}
                  <div className="group relative" data-animate="scale-in">
                    <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl p-8 border border-gray-600/30 hover:border-gray-500/60 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-gray-400/25">
                      <div className="w-20 h-20 bg-gray-400/30 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-gray-400/50 transition-all duration-300 group-hover:scale-110">
                        <span className="text-4xl">✅</span>
                      </div>
                      <h3 className="text-2xl font-medium text-white mb-4 text-center group-hover:text-gray-300 transition-colors duration-300">Garantie de Place</h3>
                      <p className="text-gray-300 text-center mb-6 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                        Votre table est garantie même en période d&apos;affluence. Plus d&apos;attente, plus de stress !
                      </p>
                    </div>
                    {/* Élément décoratif */}
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-gray-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                  </div>

                  {/* Avantage 2 - Service personnalisé */}
                  <div className="group relative" data-animate="scale-in">
                    <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl p-8 border border-gray-600/30 hover:border-gray-500/60 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-gray-400/25">
                      <div className="w-20 h-20 bg-gray-400/30 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-gray-400/50 transition-all duration-300 group-hover:scale-110">
                        <span className="text-4xl">👑</span>
                      </div>
                      <h3 className="text-2xl font-medium text-white mb-4 text-center group-hover:text-gray-300 transition-colors duration-300">Service Personnalisé</h3>
                      <p className="text-gray-300 text-center mb-6 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                        Notre équipe prépare votre arrivée et s&apos;adapte à vos besoins spécifiques.
                      </p>
                    </div>
                    {/* Élément décoratif */}
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-gray-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                  </div>

                  {/* Avantage 3 - Flexibilité */}
                  <div className="group relative" data-animate="scale-in">
                    <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl p-8 border border-gray-600/30 hover:border-gray-500/60 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-gray-400/25">
                      <div className="w-20 h-20 bg-gray-400/30 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-gray-400/50 transition-all duration-300 group-hover:scale-110">
                        <span className="text-4xl">🔄</span>
                      </div>
                      <h3 className="text-2xl font-medium text-white mb-4 text-center group-hover:text-gray-300 transition-colors duration-300">Flexibilité Totale</h3>
                      <p className="text-gray-300 text-center mb-6 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                        Modifiez ou annulez votre réservation jusqu&apos;à 24h avant sans frais.
                      </p>
                    </div>
                    {/* Élément décoratif */}
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-gray-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                  </div>
                </div>
              </div>

              {/* Section Call-to-Action finale */}
              <div className="text-center" data-animate="slide-in-bottom">
                <div className="bg-gradient-to-r from-yellow-400/10 via-green-500/10 to-blue-500/10 backdrop-blur-xl rounded-3xl p-12 border border-yellow-400/20">
                  <h2 className="text-4xl font-light text-white mb-6">Prêt à réserver ?</h2>
                  <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                    Réservez votre table dès maintenant et préparez-vous à vivre une expérience gastronomique exceptionnelle.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-medium py-4 px-8 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-400/25">
                      Réserver maintenant
                    </button>
                    <button className="border-2 border-yellow-400/50 hover:border-yellow-400 text-yellow-400 hover:text-white hover:bg-yellow-400 font-medium py-4 px-8 rounded-2xl transition-all duration-300 hover:scale-105">
                      Nous appeler
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        
        
        {activePage === 'localisation' && (
          <div className="flex-1 w-full pt-8 px-4">
            {/* Layout en grille asymétrique moderne */}
            <div className="max-w-7xl mx-auto">
              
              {/* Section Hero avec image de fond */}
              <div className="relative h-64 sm:h-80 md:h-96 rounded-2xl sm:rounded-3xl overflow-hidden mb-8 sm:mb-12 md:mb-16 group" data-animate="fade-in-up">
                <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div className="relative z-10 h-full flex items-end p-4 sm:p-6 md:p-8 lg:p-12">
                  <div className="text-white">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-thin mb-2 sm:mb-3 md:mb-4 tracking-wider capture-it-font">
                      Notre <span className="text-yellow-400 italic">Localisation</span>
                    </h1>
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-200 max-w-2xl leading-relaxed">
                      Venez nous découvrir au cœur de Bruxelles, dans un cadre chaleureux et accueillant 
                      où tradition et modernité se rencontrent.
                    </p>
                  </div>
                </div>
                {/* Éléments décoratifs flottants */}
                <div className="absolute top-4 sm:top-6 md:top-8 right-4 sm:right-6 md:right-8 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-blue-400/20 rounded-full blur-xl group-hover:bg-blue-400/30 transition-all duration-700"></div>
                <div className="absolute bottom-8 sm:bottom-12 md:bottom-16 left-6 sm:left-8 md:left-12 w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-purple-400/20 rounded-full blur-xl group-hover:bg-purple-400/30 transition-all duration-700"></div>
              </div>

              {/* Grille principale avec sections alternées */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
                
                {/* Section Adresse fusionnée avec carte - Large */}
                <div className="lg:col-span-8" data-animate="slide-in-left">
                  <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-600/30 hover:border-gray-500/50 transition-all duration-500 group">
                    <div className="flex items-center mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-gray-500 to-gray-600 rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform duration-300">
                        <span className="text-3xl">📍</span>
                      </div>
                      <div>
                        <h2 className="text-3xl font-light text-white mb-2 capture-it-font">Notre Adresse</h2>
                        <div className="w-20 h-0.5 bg-gray-400 rounded-full"></div>
                      </div>
                    </div>
                    
                    {/* Carte Google Maps intégrée */}
                    <div className="w-full h-96 rounded-2xl overflow-hidden border border-gray-600/50 mb-6">
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2518.6666!2d4.3556!3d50.8863!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c3c47e5b5b1234%3A0x5678!2sRue%20de%20Wand%2064%2C%201020%20Laeken%2C%20Belgium!5e0!3m2!1sfr!2sfr!4v1234567890123!5m2!1sfr!2sfr"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="rounded-2xl"
                      />
                    </div>
                    
                    {/* Adresse sous la carte */}
                    <div className="bg-gradient-to-r from-gray-500/20 to-gray-600/20 rounded-2xl p-6 border border-gray-400/30">
                      <div className="flex items-center mb-4">
                        <span className="text-3xl mr-4">🏢</span>
                        <div>
                          <h4 className="text-2xl font-medium text-white">Bokheat</h4>
                          <p className="text-gray-300 text-lg">Restaurant & Snack</p>
                        </div>
                      </div>
                      <div className="space-y-3 text-gray-200">
                        <p className="text-xl"><strong>Rue de Wand 64</strong></p>
                        <p className="text-xl">1020 Laeken, Bruxelles</p>
                        <p className="text-xl">Belgique</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section Horaires - Étroite */}
                <div className="lg:col-span-4" data-animate="slide-in-right">
                  <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-600/30 h-full flex flex-col justify-center">
                    <div className="text-center mb-6">
                      <div className="w-20 h-20 bg-gray-400/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-4xl">🕒</span>
                      </div>
                      <h3 className="text-2xl font-light text-white mb-2">Horaires d&apos;Ouverture</h3>
                      <div className="w-16 h-0.5 bg-gray-400 rounded-full mx-auto"></div>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                        <h4 className="text-lg font-medium text-white mb-3">Lundi - Vendredi</h4>
                        <div className="space-y-2 text-gray-200">
                          <p className="flex items-center"><span className="text-yellow-400 mr-2">🌅</span> 11h00 - 14h30</p>
                          <p className="flex items-center"><span className="text-orange-400 mr-2">🌆</span> 17h30 - 22h00</p>
                        </div>
                      </div>
                      <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                        <h4 className="text-lg font-medium text-white mb-3">Samedi - Dimanche</h4>
                        <div className="space-y-2 text-gray-200">
                          <p className="flex items-center"><span className="text-yellow-400 mr-2">🌅</span> 11h00 - 23h00</p>
                          <p className="text-gray-400 text-sm">Ouvert en continu</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>





              {/* Section Call-to-Action finale */}
              <div className="text-center" data-animate="slide-in-bottom">
                <div className="bg-gradient-to-r from-blue-400/10 via-purple-500/10 to-green-500/10 backdrop-blur-xl rounded-3xl p-12 border border-blue-400/20">
                  <h2 className="text-4xl font-light text-white mb-6">Prêt à nous rendre visite ?</h2>
                  <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                    Venez découvrir notre ambiance chaleureuse et nos délicieuses spécialités dans un cadre unique.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/Commande">
                      <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-4 px-8 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-400/25">
                        Commander en ligne
                      </button>
                    </Link>
                    <button 
                      onClick={() => setActivePage('reservation')}
                      className="border-2 border-blue-400/50 hover:border-blue-400 text-blue-400 hover:text-white hover:bg-blue-400 font-medium py-4 px-8 rounded-2xl transition-all duration-300 hover:scale-105"
                    >
                      Réserver une table
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activePage === 'rejoindre' && (
          <div className="flex-1 w-full pt-8 px-4">
            {/* Layout en grille asymétrique moderne */}
            <div className="max-w-7xl mx-auto">
              
              {/* Section Hero avec image de fond */}
              <div className="relative h-64 sm:h-80 md:h-96 rounded-2xl sm:rounded-3xl overflow-hidden mb-8 sm:mb-12 md:mb-16 group" data-animate="fade-in-up">
                <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div className="relative z-10 h-full flex items-end p-4 sm:p-6 md:p-8 lg:p-12">
                  <div className="text-white">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-thin mb-2 sm:mb-3 md:mb-4 tracking-wider capture-it-font">
                      Rejoindre la <span className="text-yellow-400 italic">Communauté</span>
                    </h1>
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-200 max-w-2xl leading-relaxed">
                      Restez connecté avec Bokheat et découvrez en avant-première nos nouvelles créations, 
                      nos offres spéciales et les coulisses de notre restaurant !
                    </p>
                  </div>
                </div>
                {/* Éléments décoratifs flottants */}
                <div className="absolute top-4 sm:top-6 md:top-8 right-4 sm:right-6 md:right-8 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-yellow-400/20 rounded-full blur-xl group-hover:bg-yellow-400/30 transition-all duration-700"></div>
                <div className="absolute bottom-8 sm:bottom-12 md:bottom-16 left-6 sm:left-8 md:left-12 w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-orange-400/20 rounded-full blur-xl group-hover:bg-orange-400/30 transition-all duration-700"></div>
              </div>

              {/* Section Nous Contacter */}
              <div className="mb-16" data-animate="fade-in-up">
                <div className="text-center mb-12" data-animate="slide-in-bottom">
                  <h2 className="text-4xl font-light text-white mb-4 capture-it-font">Nous Contacter</h2>
                  <div className="w-32 h-0.5 bg-gradient-to-r from-yellow-400 via-green-500 to-blue-500 rounded-full mx-auto"></div>
                  <p className="text-xl text-gray-300 mt-6 max-w-2xl mx-auto leading-relaxed">
                    Restez connecté avec nous pour toutes vos questions et commandes
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Téléphone */}
                  <div className="group relative" data-animate="scale-in">
                    <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl p-8 border border-gray-600/30 hover:border-gray-500/60 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-gray-400/25">
                      <div className="w-20 h-20 bg-gray-400/30 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-gray-400/50 transition-all duration-300 group-hover:scale-110">
                        <span className="text-4xl">📱</span>
                      </div>
                      <h3 className="text-2xl font-medium text-white mb-4 text-center group-hover:text-gray-300 transition-colors duration-300">Téléphone</h3>
                      <p className="text-gray-300 text-center mb-6 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                        Appelez-nous directement pour vos commandes et questions
                      </p>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                          02 468 12 76
                        </div>
                      </div>
                    </div>
                    {/* Élément décoratif */}
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-gray-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                  </div>

                  {/* Email */}
                  <div className="group relative" data-animate="scale-in">
                    <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl p-8 border border-gray-600/30 hover:border-gray-500/60 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-gray-400/25">
                      <div className="w-20 h-20 bg-gray-400/30 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-gray-400/50 transition-all duration-300 group-hover:scale-110">
                        <span className="text-4xl">✉️</span>
                      </div>
                      <h3 className="text-2xl font-medium text-white mb-4 text-center group-hover:text-gray-300 transition-colors duration-300">Email</h3>
                      <p className="text-gray-300 text-center mb-6 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                        Écrivez-nous pour vos demandes spéciales et réservations
                      </p>
                      <div className="text-center">
                        <div className="text-xl font-semibold text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                          contact@Bokheat.be
                        </div>
                      </div>
                    </div>
                    {/* Élément décoratif */}
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-gray-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                  </div>
                </div>
              </div>

              {/* Grille principale avec sections alternées */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
                
                {/* Section Introduction - Large */}
                <div className="lg:col-span-8" data-animate="slide-in-left">
                  <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-600/30 hover:border-green-400/50 transition-all duration-500 group">
                    <div className="flex items-center mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform duration-300">
                        <span className="text-3xl">🌟</span>
                      </div>
                      <div>
                        <h2 className="text-3xl font-light text-white mb-2 capture-it-font">Rejoignez Notre Communauté</h2>
                        <div className="w-20 h-0.5 bg-green-400 rounded-full"></div>
                      </div>
                    </div>
                    <p className="text-lg text-gray-300 leading-relaxed mb-6">
                      Restez connecté avec Bokheat et découvrez en avant-première nos nouvelles créations, 
                      nos offres spéciales et les coulisses de notre restaurant ! Rejoignez notre communauté 
                      de passionnés de gastronomie.
                    </p>
                    <div className="bg-gradient-to-r from-green-400/20 to-blue-500/20 rounded-2xl p-6 border border-green-400/30">
                      <h4 className="text-xl font-medium text-white mb-4">Pourquoi nous suivre ?</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-3">
                          <span className="text-green-400 text-xl">✓</span>
                          <span className="text-gray-200">Nouvelles recettes en avant-première</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-green-400 text-xl">✓</span>
                          <span className="text-gray-200">Offres exclusives et promotions</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-green-400 text-xl">✓</span>
                          <span className="text-gray-200">Coups de cœur du chef</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-green-400 text-xl">✓</span>
                          <span className="text-gray-200">Photos et vidéos des coulisses</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section Événements - Étroite */}
                <div className="lg:col-span-4" data-animate="slide-in-right">
                  <div className="bg-gradient-to-br from-orange-800/80 to-red-900/80 backdrop-blur-xl rounded-3xl p-8 border border-orange-600/30 h-full flex flex-col justify-center">
                    <div className="text-center mb-6">
                      <div className="w-20 h-20 bg-orange-400/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-4xl">🎉</span>
                      </div>
                      <h3 className="text-2xl font-light text-white mb-2">Événements & Anniversaires</h3>
                      <div className="w-16 h-0.5 bg-orange-400 rounded-full mx-auto"></div>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                        <h4 className="text-lg font-medium text-white mb-3">🍔 Anniversaires gourmands</h4>
                        <p className="text-gray-300 text-sm">Découvrez nos nouvelles créations en avant-première</p>
                        <p className="text-orange-400 text-sm mt-2">Contactez-nous pour plus d&apos;informations</p>
                      </div>
                      <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                        <h4 className="text-lg font-medium text-white mb-3">🎭 Soirées Privatisées</h4>
                        <p className="text-gray-300 text-sm">Soirées privées pour vos événements</p>
                        <p className="text-orange-400 text-sm mt-2">Contactez-nous pour plus d&apos;informations</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section Réseaux Sociaux en grille */}
              <div className="mb-16" data-animate="fade-in-up">
                <div className="text-center mb-12" data-animate="slide-in-bottom">
                  <h2 className="text-4xl font-light text-white mb-4 capture-it-font">Nos Réseaux Sociaux</h2>
                  <div className="w-32 h-0.5 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full mx-auto"></div>
                  <p className="text-xl text-gray-300 mt-6 max-w-2xl mx-auto leading-relaxed">
                    Suivez-nous sur tous nos réseaux pour rester connecté avec Bokheat
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Facebook */}
                  <div className="group relative" data-animate="scale-in">
                    <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-xl rounded-2xl p-6 border border-blue-400/30 hover:border-blue-400/60 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-400/25">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      </div>
                      <h4 className="text-xl font-medium text-white mb-3 text-center group-hover:text-blue-400 transition-colors duration-300">Facebook</h4>
                      <p className="text-gray-300 text-center mb-4 text-sm leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                        Actualités, photos et événements
                      </p>
                      <div className="text-center">
                        <div className="text-blue-400 font-semibold group-hover:text-blue-300 transition-colors duration-300">@Bokheat</div>
                      </div>
                    </div>
                    {/* Élément décoratif */}
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                  </div>

                  {/* Instagram */}
                  <div className="group relative" data-animate="scale-in">
                    <div className="bg-gradient-to-br from-pink-500/20 to-purple-500/20 backdrop-blur-xl rounded-2xl p-6 border border-pink-400/30 hover:border-pink-400/60 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-pink-400/25">
                      <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                        <Image 
                          src="/instaicone.png" 
                          alt="Instagram" 
                          width={64} 
                          height={64}
                          className="w-12 h-12"
                        />
                      </div>
                      <h4 className="text-xl font-medium text-white mb-3 text-center group-hover:text-pink-400 transition-colors duration-300">Instagram</h4>
                      <p className="text-gray-300 text-center mb-4 text-sm leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                        Photos et stories quotidiennes
                      </p>
                      <div className="text-center">
                        <div className="text-pink-400 font-semibold group-hover:text-pink-300 transition-colors duration-300">@Bokheat</div>
                      </div>
                    </div>
                    {/* Élément décoratif */}
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-pink-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                  </div>

                  {/* TikTok */}
                  <div className="group relative" data-animate="scale-in">
                    <div className="bg-gradient-to-br from-red-500/20 to-red-600/20 backdrop-blur-xl rounded-2xl p-6 border border-red-400/30 hover:border-red-400/60 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-red-400/25">
                      <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                        </svg>
                      </div>
                      <h4 className="text-xl font-medium text-white mb-3 text-center group-hover:text-red-400 transition-colors duration-300">TikTok</h4>
                      <p className="text-gray-300 text-center mb-4 text-sm leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                        Vidéos courtes et fun
                      </p>
                      <div className="text-center">
                        <div className="text-red-400 font-semibold group-hover:text-red-300 transition-colors duration-300">@Bokheat</div>
                      </div>
                    </div>
                    {/* Élément décoratif */}
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                  </div>

                  {/* WhatsApp */}
                  <div className="group relative" data-animate="scale-in">
                    <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-xl rounded-2xl p-6 border border-green-400/30 hover:border-green-400/60 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-400/25">
                      <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.374l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                        </svg>
                      </div>
                      <h4 className="text-xl font-medium text-white mb-3 text-center group-hover:text-green-400 transition-colors duration-300">WhatsApp</h4>
                      <p className="text-gray-300 text-center mb-4 text-sm leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                        Commandes spéciales et questions
                      </p>
                      <div className="text-center">
                        <div className="text-green-400 font-semibold group-hover:text-green-300 transition-colors duration-300">+32 468 12 76</div>
                      </div>
                    </div>
                    {/* Élément décoratif */}
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                  </div>
                </div>
              </div>

              {/* Section Call-to-Action finale */}
              <div className="text-center" data-animate="slide-in-bottom">
                <div className="bg-gradient-to-r from-yellow-400/10 via-orange-500/10 to-red-500/10 backdrop-blur-xl rounded-3xl p-12 border border-yellow-400/20">
                  <h2 className="text-4xl font-light text-white mb-6">Prêt à nous rejoindre ?</h2>
                  <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                    Rejoignez notre communauté et restez connecté avec Bokheat pour ne manquer aucune nouveauté !
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-medium py-4 px-8 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/50">
                      Suivre sur Instagram
                    </button>
                    <button className="border-2 border-yellow-400/50 hover:border-yellow-400 text-yellow-400 hover:text-white hover:bg-yellow-400 font-medium py-4 px-8 rounded-2xl transition-all duration-300 hover:scale-105">
                      Voir tous nos réseaux
                    </button>
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

