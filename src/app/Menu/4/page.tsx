"use client";
import Image from "next/image";

export default function MenuPage4() {
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
                Delice Wand - Boissons
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
                  Nos Boissons
                </h2>
                <div className="w-[95%] h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mx-auto animate-pulse"></div>
                <p className="text-xl text-gray-200 mt-6">
                  Désaltérez-vous avec notre sélection de boissons rafraîchissantes
                </p>
              </div>

              {/* Section Sodas & Boissons Gazeuses */}
              <div className="mb-16">
                <h3 className="text-4xl font-bold text-white mb-8 text-center">🥤 Sodas & Boissons Gazeuses</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
                  
                  {/* Soda 1 */}
                  <div className="group bg-gradient-to-br from-gray-700/80 to-gray-800/80 backdrop-blur-md rounded-2xl p-6 border border-gray-600/50 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/20">
                    <div className="relative overflow-hidden rounded-xl mb-4">
                      <Image
                        src="/Coca.png"
                        alt="Coca-Cola"
                        width={300}
                        height={200}
                        className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2">Coca-Cola</h4>
                    <p className="text-gray-300 text-sm mb-3">
                      Canette 33cl - Le goût original
                    </p>
                    <span className="text-2xl font-bold text-yellow-400">2,50€</span>
                  </div>

                  {/* Soda 2 */}
                  <div className="group bg-gradient-to-br from-gray-700/80 to-gray-800/80 backdrop-blur-md rounded-2xl p-6 border border-gray-600/50 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/20">
                    <div className="relative overflow-hidden rounded-xl mb-4">
                      <Image
                        src="/pepsi.png"
                        alt="Pepsi"
                        width={300}
                        height={200}
                        className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2">Pepsi</h4>
                    <p className="text-gray-300 text-sm mb-3">
                      Canette 33cl - Saveur unique
                    </p>
                    <span className="text-2xl font-bold text-yellow-400">2,50€</span>
                  </div>

                  {/* Soda 3 */}
                  <div className="group bg-gradient-to-br from-gray-700/80 to-gray-800/80 backdrop-blur-md rounded-2xl p-6 border border-gray-600/50 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/20">
                    <div className="relative overflow-hidden rounded-xl mb-4">
                      <Image
                        src="/fanta.png"
                        alt="Fanta Orange"
                        width={300}
                        height={200}
                        className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2">Fanta Orange</h4>
                    <p className="text-gray-300 text-sm mb-3">
                      Canette 33cl - Goût orange
                    </p>
                    <span className="text-2xl font-bold text-yellow-400">2,50€</span>
                  </div>

                  {/* Soda 4 */}
                  <div className="group bg-gradient-to-br from-gray-700/80 to-gray-800/80 backdrop-blur-md rounded-2xl p-6 border border-gray-600/50 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/20">
                    <div className="relative overflow-hidden rounded-xl mb-4">
                      <Image
                        src="/sprite.png"
                        alt="Sprite"
                        width={300}
                        height={200}
                        className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2">Sprite</h4>
                    <p className="text-gray-300 text-sm mb-3">
                      Canette 33cl - Citron-lime
                    </p>
                    <span className="text-2xl font-bold text-yellow-400">2,50€</span>
                  </div>

                  {/* Soda 5 */}
                  <div className="group bg-gradient-to-br from-gray-700/80 to-gray-800/80 backdrop-blur-md rounded-2xl p-6 border border-gray-600/50 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/20">
                    <div className="relative overflow-hidden rounded-xl mb-4">
                      <Image
                        src="/icetea.png"
                        alt="Ice Tea"
                        width={300}
                        height={200}
                        className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2">Ice Tea Pêche</h4>
                    <p className="text-gray-300 text-sm mb-3">
                      Canette 33cl - Thé glacé pêche
                    </p>
                    <span className="text-2xl font-bold text-yellow-400">2,80€</span>
                  </div>

                  {/* Limonade */}
                  <div className="group bg-gradient-to-br from-gray-700/80 to-gray-800/80 backdrop-blur-md rounded-2xl p-6 border border-gray-600/50 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/20">
                    <div className="relative overflow-hidden rounded-xl mb-4">
                      <Image
                        src="https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=300&h=200&fit=crop"
                        alt="Limonade Maison"
                        width={300}
                        height={200}
                        className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2">Limonade Maison</h4>
                    <p className="text-gray-300 text-sm mb-3">
                      Citron frais, menthe, eau gazeuse
                    </p>
                    <span className="text-2xl font-bold text-yellow-400">3,50€</span>
                  </div>

                  {/* Diabolo */}
                  <div className="group bg-gradient-to-br from-gray-700/80 to-gray-800/80 backdrop-blur-md rounded-2xl p-6 border border-gray-600/50 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/20">
                    <div className="relative overflow-hidden rounded-xl mb-4">
                      <Image
                        src="https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300&h=200&fit=crop"
                        alt="Diabolo"
                        width={300}
                        height={200}
                        className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2">Diabolo</h4>
                    <p className="text-gray-300 text-sm mb-3">
                      Eau gazeuse + sirop au choix
                    </p>
                    <span className="text-2xl font-bold text-yellow-400">3,00€</span>
                  </div>

                  {/* Perrier */}
                  <div className="group bg-gradient-to-br from-gray-700/80 to-gray-800/80 backdrop-blur-md rounded-2xl p-6 border border-gray-600/50 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/20">
                    <div className="relative overflow-hidden rounded-xl mb-4">
                      <Image
                        src="https://images.unsplash.com/photo-1571613316887-6f8d5cbf7ef7?w=300&h=200&fit=crop"
                        alt="Perrier"
                        width={300}
                        height={200}
                        className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2">Perrier</h4>
                    <p className="text-gray-300 text-sm mb-3">
                      Bouteille 33cl - Eau gazeuse
                    </p>
                    <span className="text-2xl font-bold text-yellow-400">2,80€</span>
                  </div>
                </div>
              </div>

              {/* Section Jus de Fruits & Smoothies */}
              <div className="mb-16">
                <h3 className="text-4xl font-bold text-white mb-8 text-center">🍊 Jus de Fruits & Smoothies</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                  
                  {/* Jus 1 */}
                  <div className="group bg-gradient-to-br from-gray-700/80 to-gray-800/80 backdrop-blur-md rounded-2xl p-6 border border-gray-600/50 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/20">
                    <div className="relative overflow-hidden rounded-xl mb-4">
                      <Image
                        src="https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=300&h=200&fit=crop"
                        alt="Jus d&apos;Orange Frais"
                        width={300}
                        height={200}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <h4 className="text-2xl font-bold text-white mb-3">Jus d&apos;Orange Frais</h4>
                    <p className="text-gray-300 leading-relaxed mb-4">
                      Oranges pressées à la minute, 100% naturel sans sucre ajouté
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-3xl font-bold text-yellow-400">4,50€</span>
                      <div className="flex space-x-2">
                        <span className="bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full text-sm">🍊 Frais</span>
                      </div>
                    </div>
                  </div>

                  {/* Jus 2 */}
                  <div className="group bg-gradient-to-br from-gray-700/80 to-gray-800/80 backdrop-blur-md rounded-2xl p-6 border border-gray-600/50 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/20">
                    <div className="relative overflow-hidden rounded-xl mb-4">
                      <Image
                        src="https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=300&h=200&fit=crop"
                        alt="Smoothie Fruits Rouges"
                        width={300}
                        height={200}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <h4 className="text-2xl font-bold text-white mb-3">Smoothie Fruits Rouges</h4>
                    <p className="text-gray-300 leading-relaxed mb-4">
                      Fraises, framboises, myrtilles, yaourt grec et miel de lavande
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-3xl font-bold text-yellow-400">5,90€</span>
                      <div className="flex space-x-2">
                        <span className="bg-pink-500/20 text-pink-400 px-3 py-1 rounded-full text-sm">🍓 Antioxydant</span>
                      </div>
                    </div>
                  </div>

                  {/* Jus 3 */}
                  <div className="group bg-gradient-to-br from-gray-700/80 to-gray-800/80 backdrop-blur-md rounded-2xl p-6 border border-gray-600/50 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/20">
                    <div className="relative overflow-hidden rounded-xl mb-4">
                      <Image
                        src="https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=300&h=200&fit=crop"
                        alt="Smoothie Vert Détox"
                        width={300}
                        height={200}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <h4 className="text-2xl font-bold text-white mb-3">Smoothie Vert Détox</h4>
                    <p className="text-gray-300 leading-relaxed mb-4">
                      Épinards, concombre, pomme verte, gingembre, citron et menthe fraîche
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-3xl font-bold text-yellow-400">5,50€</span>
                      <div className="flex space-x-2">
                        <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">🌿 Détox</span>
                      </div>
                    </div>
                  </div>

                  {/* Jus 4 */}
                  <div className="group bg-gradient-to-br from-gray-700/80 to-gray-800/80 backdrop-blur-md rounded-2xl p-6 border border-gray-600/50 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/20">
                    <div className="relative overflow-hidden rounded-xl mb-4">
                      <Image
                        src="https://images.unsplash.com/photo-1546173159-315724a31696?w=300&h=200&fit=crop"
                        alt="Jus de Pomme"
                        width={300}
                        height={200}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <h4 className="text-2xl font-bold text-white mb-3">Jus de Pomme Bio</h4>
                    <p className="text-gray-300 leading-relaxed mb-4">
                      Pommes biologiques de nos producteurs locaux, pressées à froid
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-3xl font-bold text-yellow-400">3,90€</span>
                      <div className="flex space-x-2">
                        <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">🍎 Bio</span>
                      </div>
                    </div>
                  </div>

                  {/* Jus 5 */}
                  <div className="group bg-gradient-to-br from-gray-700/80 to-gray-800/80 backdrop-blur-md rounded-2xl p-6 border border-gray-600/50 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/20">
                    <div className="relative overflow-hidden rounded-xl mb-4">
                      <Image
                        src="https://images.unsplash.com/photo-1560963805-6c64417e3073?w=300&h=200&fit=crop"
                        alt="Smoothie Tropical"
                        width={300}
                        height={200}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <h4 className="text-2xl font-bold text-white mb-3">Smoothie Tropical</h4>
                    <p className="text-gray-300 leading-relaxed mb-4">
                      Mangue, ananas, fruit de la passion, lait de coco et zeste de lime
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-3xl font-bold text-yellow-400">6,50€</span>
                      <div className="flex space-x-2">
                        <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-sm">🏝️ Tropical</span>
                      </div>
                    </div>
                  </div>

                  {/* Jus 6 */}
                  <div className="group bg-gradient-to-br from-gray-700/80 to-gray-800/80 backdrop-blur-md rounded-2xl p-6 border border-gray-600/50 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/20">
                    <div className="relative overflow-hidden rounded-xl mb-4">
                      <Image
                        src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=300&h=200&fit=crop"
                        alt="Jus de Carotte Gingembre"
                        width={300}
                        height={200}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <h4 className="text-2xl font-bold text-white mb-3">Jus Carotte-Gingembre</h4>
                    <p className="text-gray-300 leading-relaxed mb-4">
                      Carottes fraîches, gingembre bio, orange et une pointe de curcuma
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-3xl font-bold text-yellow-400">4,90€</span>
                      <div className="flex space-x-2">
                        <span className="bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full text-sm">⚡ Énergisant</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section Eaux & Boissons Sans Alcool */}
              <div className="mb-16">
                <h3 className="text-4xl font-bold text-white mb-8 text-center">💧 Eaux & Boissons Sans Alcool</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                  
                  {/* Eau 1 */}
                  <div className="group bg-gradient-to-br from-gray-700/80 to-gray-800/80 backdrop-blur-md rounded-2xl p-4 border border-gray-600/50 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-xl">💧</span>
                      </div>
                      <h4 className="text-lg font-bold text-white mb-2">Eau Plate</h4>
                      <p className="text-gray-300 text-sm mb-2">50cl</p>
                      <span className="text-xl font-bold text-yellow-400">2,00€</span>
                    </div>
                  </div>

                  {/* Eau 2 */}
                  <div className="group bg-gradient-to-br from-gray-700/80 to-gray-800/80 backdrop-blur-md rounded-2xl p-4 border border-gray-600/50 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-xl">🫧</span>
                      </div>
                      <h4 className="text-lg font-bold text-white mb-2">Eau Gazeuse</h4>
                      <p className="text-gray-300 text-sm mb-2">50cl</p>
                      <span className="text-xl font-bold text-yellow-400">2,20€</span>
                    </div>
                  </div>

                  {/* Lait */}
                  <div className="group bg-gradient-to-br from-gray-700/80 to-gray-800/80 backdrop-blur-md rounded-2xl p-4 border border-gray-600/50 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-white to-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-xl">🥛</span>
                      </div>
                      <h4 className="text-lg font-bold text-white mb-2">Lait</h4>
                      <p className="text-gray-300 text-sm mb-2">25cl</p>
                      <span className="text-xl font-bold text-yellow-400">2,50€</span>
                    </div>
                  </div>

                  {/* Lait d'amande */}
                  <div className="group bg-gradient-to-br from-gray-700/80 to-gray-800/80 backdrop-blur-md rounded-2xl p-4 border border-gray-600/50 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-xl">🌰</span>
                      </div>
                      <h4 className="text-lg font-bold text-white mb-2">Lait d&apos;Amande</h4>
                      <p className="text-gray-300 text-sm mb-2">25cl</p>
                      <span className="text-xl font-bold text-yellow-400">3,00€</span>
                    </div>
                  </div>

                  {/* Kombucha */}
                  <div className="group bg-gradient-to-br from-gray-700/80 to-gray-800/80 backdrop-blur-md rounded-2xl p-4 border border-gray-600/50 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-teal-400 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-xl">🧪</span>
                      </div>
                      <h4 className="text-lg font-bold text-white mb-2">Kombucha</h4>
                      <p className="text-gray-300 text-sm mb-2">33cl</p>
                      <span className="text-xl font-bold text-yellow-400">4,50€</span>
                    </div>
                  </div>

                  {/* Kéfir */}
                  <div className="group bg-gradient-to-br from-gray-700/80 to-gray-800/80 backdrop-blur-md rounded-2xl p-4 border border-gray-600/50 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-xl">🥤</span>
                      </div>
                      <h4 className="text-lg font-bold text-white mb-2">Kéfir de Fruits</h4>
                      <p className="text-gray-300 text-sm mb-2">25cl</p>
                      <span className="text-xl font-bold text-yellow-400">3,80€</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section informations pratiques */}
              <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">❄️</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Toujours Frais</h3>
                  <p className="text-gray-200">Toutes nos boissons sont servies bien fraîches</p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🌱</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Options Naturelles</h3>
                  <p className="text-gray-200">Jus pressés à froid, smoothies sans conservateurs</p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🥤</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Format Généreux</h3>
                  <p className="text-gray-200">Quantités adaptées pour bien vous désaltérer</p>
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

