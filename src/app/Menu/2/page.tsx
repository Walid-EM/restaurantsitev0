"use client";
import Image from "next/image";

export default function MenuPage2() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec navigation */}
      <header className="bg-black/60 backdrop-blur-sm border-b border-gray-600/50 text-white fixed top-0 left-0 right-0 z-50 shadow-2xl">
        <div className="flex items-center h-20 w-full px-6">
          {/* Logo + Titre centré */}
          <div className="flex-shrink-0 mx-auto">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Image
                  src="/cheeseburger.png"
                  alt="Cheeseburger Logo"
                  width={40}
                  height={40}
                  className="w-10 h-10"
                />
                <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-xl transition-all duration-300"></div>
              </div>
              <h1 className="text-xl xl:text-3xl font-bold text-white">
                Delice Wand - Plats Principaux
              </h1>
            </div>
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
        
        {/* Overlay sombre pour améliorer la lisibilité */}
        <div className="absolute inset-0 bg-black/50 bg-opacity-40 z-20 backdrop-blur-md"></div>
      </div>

      {/* Contenu principal qui prend tout l'écran */}
      <div className="relative z-30 min-h-screen overflow-y-auto flex flex-col">
        {/* Espace pour le header */}
        <div className="h-20 flex-shrink-0"></div>
        
        <div className="flex-1 flex flex-col items-center justify-start w-full">
          {/* Section principale du menu */}
          <div className="w-full max-w-7xl px-4 sm:px-6 pt-8 pb-12 mx-auto">
            {/* Conteneur principal avec fond semi-transparent */}
            <div className="bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-md rounded-3xl p-8 border border-gray-600/50 shadow-2xl shadow-black/50 relative overflow-hidden">
              
              {/* Titre de la section */}
              <div className="text-center mb-12">
                <h2 className="text-5xl xl:text-6xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent drop-shadow-lg">
                  Plats Principaux
                </h2>
                <div className="w-[95%] h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mx-auto animate-pulse"></div>
                <p className="text-xl text-gray-200 mt-6">
                  Nos spécialités gourmandes qui raviront vos papilles
                </p>
              </div>

              {/* Grille des produits */}
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                
                {/* Produit 1 */}
                <div className="group bg-gradient-to-br from-gray-700/80 to-gray-800/80 backdrop-blur-md rounded-2xl p-6 border border-gray-600/50 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/20">
                  <div className="relative overflow-hidden rounded-xl mb-4">
                    <Image
                      src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop"
                      alt="Burger Signature Delice Wand"
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Burger Signature Delice Wand</h3>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Steak haché 200g, cheddar affiné, bacon croustillant, tomate, salade, oignons caramélisés et notre sauce signature
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-3xl font-bold text-yellow-400">16,90€</span>
                    <div className="flex space-x-2">
                      <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm">🏆 Signature</span>
                    </div>
                  </div>
                </div>

                {/* Produit 2 */}
                <div className="group bg-gradient-to-br from-gray-700/80 to-gray-800/80 backdrop-blur-md rounded-2xl p-6 border border-gray-600/50 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/20">
                  <div className="relative overflow-hidden rounded-xl mb-4">
                    <Image
                      src="https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop"
                      alt="Pizza Margherita Artisanale"
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Pizza Margherita Artisanale</h3>
                  <p className="text-gray-300 leading-relaxed mb-4">
                                            Pâte fine maison, sauce tomate San Marzano, mozzarella di buffala, basilic frais et huile d&apos;olive extra vierge
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-3xl font-bold text-yellow-400">14,50€</span>
                    <div className="flex space-x-2">
                      <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">🇮🇹 Italienne</span>
                    </div>
                  </div>
                </div>

                {/* Produit 3 */}
                <div className="group bg-gradient-to-br from-gray-700/80 to-gray-800/80 backdrop-blur-md rounded-2xl p-6 border border-gray-600/50 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/20">
                  <div className="relative overflow-hidden rounded-xl mb-4">
                    <Image
                      src="https://images.unsplash.com/photo-1558030006-450675393462?w=300&h=200&fit=crop"
                      alt="Saumon Grillé aux Herbes"
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Saumon Grillé aux Herbes</h3>
                  <p className="text-gray-300 leading-relaxed mb-4">
                                            Filet de saumon norvégien, risotto aux champignons, légumes de saison et beurre blanc à l&apos;aneth
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-3xl font-bold text-yellow-400">22,90€</span>
                    <div className="flex space-x-2">
                      <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm">🐟 Poisson</span>
                      <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-sm">⭐ Premium</span>
                    </div>
                  </div>
                </div>

                {/* Produit 4 */}
                <div className="group bg-gradient-to-br from-gray-700/80 to-gray-800/80 backdrop-blur-md rounded-2xl p-6 border border-gray-600/50 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/20">
                  <div className="relative overflow-hidden rounded-xl mb-4">
                    <Image
                      src="https://images.unsplash.com/photo-1544025162-d76694265947?w=300&h=200&fit=crop"
                      alt="Entrecôte Grillée"
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Entrecôte Grillée</h3>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Entrecôte de bœuf 300g, frites maison, salade verte et sauce au poivre ou béarnaise au choix
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-3xl font-bold text-yellow-400">26,90€</span>
                    <div className="flex space-x-2">
                      <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm">🥩 Viande</span>
                    </div>
                  </div>
                </div>

                {/* Produit 5 */}
                <div className="group bg-gradient-to-br from-gray-700/80 to-gray-800/80 backdrop-blur-md rounded-2xl p-6 border border-gray-600/50 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/20">
                  <div className="relative overflow-hidden rounded-xl mb-4">
                    <Image
                      src="https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=300&h=200&fit=crop"
                      alt="Pâtes Carbonara Maison"
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Pâtes Carbonara Maison</h3>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Tagliatelles fraîches, pancetta croustillante, œufs fermiers, parmesan et poivre noir de Tellichery
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-3xl font-bold text-yellow-400">15,90€</span>
                    <div className="flex space-x-2">
                      <span className="bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full text-sm">🍝 Pâtes</span>
                    </div>
                  </div>
                </div>

                {/* Produit 6 */}
                <div className="group bg-gradient-to-br from-gray-700/80 to-gray-800/80 backdrop-blur-md rounded-2xl p-6 border border-gray-600/50 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/20">
                  <div className="relative overflow-hidden rounded-xl mb-4">
                    <Image
                      src="https://images.unsplash.com/photo-1562967914-608f82629710?w=300&h=200&fit=crop"
                      alt="Poulet Rôti aux Épices"
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Poulet Rôti aux Épices</h3>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Demi-poulet fermier, pommes de terre grenaille au romarin, ratatouille provençale et jus corsé
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-3xl font-bold text-yellow-400">18,90€</span>
                    <div className="flex space-x-2">
                      <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-sm">🐔 Volaille</span>
                    </div>
                  </div>
                </div>

                {/* Produit 7 */}
                <div className="group bg-gradient-to-br from-gray-700/80 to-gray-800/80 backdrop-blur-md rounded-2xl p-6 border border-gray-600/50 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/20">
                  <div className="relative overflow-hidden rounded-xl mb-4">
                    <Image
                      src="https://images.unsplash.com/photo-1574484284002-952d92456975?w=300&h=200&fit=crop"
                      alt="Wok de Légumes"
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Wok de Légumes</h3>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Légumes croquants sautés au wok, tofu grillé, nouilles de riz, sauce soja-gingembre et graines de sésame
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-3xl font-bold text-yellow-400">14,90€</span>
                    <div className="flex space-x-2">
                      <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">🌱 Végé</span>
                      <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm">💚 Vegan</span>
                    </div>
                  </div>
                </div>

                {/* Produit 8 */}
                <div className="group bg-gradient-to-br from-gray-700/80 to-gray-800/80 backdrop-blur-md rounded-2xl p-6 border border-gray-600/50 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/20">
                  <div className="relative overflow-hidden rounded-xl mb-4">
                    <Image
                      src="https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=300&h=200&fit=crop"
                      alt="Fish & Chips Maison"
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Fish & Chips Maison</h3>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Filet de cabillaud en pâte à bière, frites épaisses, petits pois à la menthe et sauce tartare maison
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-3xl font-bold text-yellow-400">17,90€</span>
                    <div className="flex space-x-2">
                      <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm">🐟 Poisson</span>
                      <span className="bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full text-sm">🇬🇧 British</span>
                    </div>
                  </div>
                </div>

                {/* Produit 9 */}
                <div className="group bg-gradient-to-br from-gray-700/80 to-gray-800/80 backdrop-blur-md rounded-2xl p-6 border border-gray-600/50 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/20">
                  <div className="relative overflow-hidden rounded-xl mb-4">
                    <Image
                      src="https://images.unsplash.com/photo-1565299507177-b0ac66763ed1?w=300&h=200&fit=crop"
                      alt="Burger Végétarien"
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Burger Végétarien</h3>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Steak végétal aux légumes, avocat, fromage de chèvre, tomates confites et pesto de basilic
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-3xl font-bold text-yellow-400">15,50€</span>
                    <div className="flex space-x-2">
                      <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">🌱 Végé</span>
                    </div>
                  </div>
                </div>

                {/* Produit 10 */}
                <div className="group bg-gradient-to-br from-gray-700/80 to-gray-800/80 backdrop-blur-md rounded-2xl p-6 border border-gray-600/50 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/20">
                  <div className="relative overflow-hidden rounded-xl mb-4">
                    <Image
                      src="https://images.unsplash.com/photo-1551326844-4df70f78d0e9?w=300&h=200&fit=crop"
                      alt="Paella Valenciana"
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Paella Valenciana</h3>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Riz bomba, poulet fermier, fruits de mer, haricots verts, safran et citron (pour 2 personnes minimum)
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-3xl font-bold text-yellow-400">24,90€</span>
                    <div className="flex space-x-2">
                      <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-sm">🇪🇸 Espagnole</span>
                      <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-sm">👥 À partager</span>
                    </div>
                  </div>
                </div>

                {/* Produit 11 */}
                <div className="group bg-gradient-to-br from-gray-700/80 to-gray-800/80 backdrop-blur-md rounded-2xl p-6 border border-gray-600/50 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/20">
                  <div className="relative overflow-hidden rounded-xl mb-4">
                    <Image
                      src="https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=300&h=200&fit=crop"
                                              alt="Tajine d&apos;Agneau aux Abricots"
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                                      <h3 className="text-2xl font-bold text-white mb-3">Tajine d&apos;Agneau aux Abricots</h3>
                  <p className="text-gray-300 leading-relaxed mb-4">
                                          Épaule d&apos;agneau confite, abricots secs, amandes, coriandre fraîche et semoule parfumée
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-3xl font-bold text-yellow-400">21,90€</span>
                    <div className="flex space-x-2">
                      <span className="bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full text-sm">🐑 Agneau</span>
                      <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm">🌶️ Épicé</span>
                    </div>
                  </div>
                </div>

                {/* Produit 12 */}
                <div className="group bg-gradient-to-br from-gray-700/80 to-gray-800/80 backdrop-blur-md rounded-2xl p-6 border border-gray-600/50 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/20">
                  <div className="relative overflow-hidden rounded-xl mb-4">
                    <Image
                      src="https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=300&h=200&fit=crop"
                      alt="Risotto aux Champignons"
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Risotto aux Champignons</h3>
                  <p className="text-gray-300 leading-relaxed mb-4">
                                            Riz arborio, mélange de champignons de saison, bouillon de volaille, parmesan et truffe d&apos;été
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-3xl font-bold text-yellow-400">19,90€</span>
                    <div className="flex space-x-2">
                      <span className="bg-brown-500/20 text-yellow-600 px-3 py-1 rounded-full text-sm">🍄 Champignons</span>
                      <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-sm">⭐ Premium</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Section informations pratiques */}
              <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-red-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">👨‍🍳</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Chef Expérimenté</h3>
                                      <p className="text-gray-200">15 ans d&apos;expérience en cuisine gastronomique</p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🔥</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Cuisson Parfaite</h3>
                  <p className="text-gray-200">Maîtrise de toutes les techniques culinaires</p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">⭐</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Qualité Premium</h3>
                  <p className="text-gray-200">Produits sélectionnés avec soin</p>
                </div>
              </div>

              {/* Ligne décorative en bas */}
              <div className="w-[95%] h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mx-auto mt-12 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Espace en bas pour s'assurer que tout le contenu soit visible */}
      <div className="h-20"></div>
    </div>
  );
}

