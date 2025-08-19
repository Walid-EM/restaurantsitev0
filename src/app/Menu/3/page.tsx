"use client";
import Image from "next/image";

export default function MenuPage3() {
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
                Delice Wand - Desserts & Café
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
                  Desserts & Café
                </h2>
                <div className="w-[95%] h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mx-auto animate-pulse"></div>
                <p className="text-xl text-gray-200 mt-6">
                  Terminez votre repas en beauté avec nos douceurs sucrées
                </p>
              </div>

              {/* Section Desserts */}
              <div className="mb-16">
                <h3 className="text-4xl font-bold text-white mb-8 text-center">🍰 Nos Desserts</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                  
                  {/* Dessert 1 */}
                  <div className="group bg-gradient-to-br from-gray-700/80 to-gray-800/80 backdrop-blur-md rounded-2xl p-6 border border-gray-600/50 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/20">
                    <div className="relative overflow-hidden rounded-xl mb-4">
                      <Image
                        src="https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=300&h=200&fit=crop"
                        alt="Tiramisu Maison"
                        width={300}
                        height={200}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <h4 className="text-2xl font-bold text-white mb-3">Tiramisu Maison</h4>
                    <p className="text-gray-300 leading-relaxed mb-4">
                      Mascarpone onctueux, café expresso, biscuits à la cuillère et cacao amer. Recette traditionnelle italienne
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-3xl font-bold text-yellow-400">8,90€</span>
                      <div className="flex space-x-2">
                        <span className="bg-brown-500/20 text-yellow-600 px-3 py-1 rounded-full text-sm">☕ Café</span>
                      </div>
                    </div>
                  </div>

                  {/* Dessert 2 */}
                  <div className="group bg-gradient-to-br from-gray-700/80 to-gray-800/80 backdrop-blur-md rounded-2xl p-6 border border-gray-600/50 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/20">
                    <div className="relative overflow-hidden rounded-xl mb-4">
                      <Image
                        src="https://images.unsplash.com/photo-1551024506-0bccd828d307?w=300&h=200&fit=crop"
                        alt="Fondant au Chocolat"
                        width={300}
                        height={200}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <h4 className="text-2xl font-bold text-white mb-3">Fondant au Chocolat</h4>
                    <p className="text-gray-300 leading-relaxed mb-4">
                      Cœur coulant au chocolat noir 70%, glace vanille bourbon et coulis de fruits rouges
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-3xl font-bold text-yellow-400">9,50€</span>
                      <div className="flex space-x-2">
                        <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm">🍫 Chocolat</span>
                      </div>
                    </div>
                  </div>

                  {/* Dessert 3 */}
                  <div className="group bg-gradient-to-br from-gray-700/80 to-gray-800/80 backdrop-blur-md rounded-2xl p-6 border border-gray-600/50 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/20">
                    <div className="relative overflow-hidden rounded-xl mb-4">
                      <Image
                        src="https://images.unsplash.com/photo-1488477181946-6428a0291777?w=300&h=200&fit=crop"
                        alt="Tarte Tatin aux Pommes"
                        width={300}
                        height={200}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <h4 className="text-2xl font-bold text-white mb-3">Tarte Tatin aux Pommes</h4>
                    <p className="text-gray-300 leading-relaxed mb-4">
                      Pommes caramélisées, pâte feuilletée croustillante et boule de glace cannelle
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-3xl font-bold text-yellow-400">7,90€</span>
                      <div className="flex space-x-2">
                        <span className="bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full text-sm">🍎 Fruits</span>
                      </div>
                    </div>
                  </div>

                  {/* Dessert 4 */}
                  <div className="group bg-gradient-to-br from-gray-700/80 to-gray-800/80 backdrop-blur-md rounded-2xl p-6 border border-gray-600/50 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/20">
                    <div className="relative overflow-hidden rounded-xl mb-4">
                      <Image
                        src="https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=300&h=200&fit=crop"
                        alt="Cheesecake New York"
                        width={300}
                        height={200}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <h4 className="text-2xl font-bold text-white mb-3">Cheesecake New York</h4>
                    <p className="text-gray-300 leading-relaxed mb-4">
                      Fromage blanc crémeux, base de biscuits graham et coulis de fruits de saison
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-3xl font-bold text-yellow-400">8,50€</span>
                      <div className="flex space-x-2">
                        <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-sm">🧀 Fromage</span>
                      </div>
                    </div>
                  </div>

                  {/* Dessert 5 */}
                  <div className="group bg-gradient-to-br from-gray-700/80 to-gray-800/80 backdrop-blur-md rounded-2xl p-6 border border-gray-600/50 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/20">
                    <div className="relative overflow-hidden rounded-xl mb-4">
                      <Image
                        src="https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=300&h=200&fit=crop"
                        alt="Profiteroles"
                        width={300}
                        height={200}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <h4 className="text-2xl font-bold text-white mb-3">Profiteroles</h4>
                    <p className="text-gray-300 leading-relaxed mb-4">
                      Choux à la crème pâtissière vanille, sauce chocolat chaud et amandes effilées
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-3xl font-bold text-yellow-400">9,90€</span>
                      <div className="flex space-x-2">
                        <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-sm">🥐 Pâtisserie</span>
                      </div>
                    </div>
                  </div>

                  {/* Dessert 6 */}
                  <div className="group bg-gradient-to-br from-gray-700/80 to-gray-800/80 backdrop-blur-md rounded-2xl p-6 border border-gray-600/50 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/20">
                    <div className="relative overflow-hidden rounded-xl mb-4">
                      <Image
                        src="https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?w=300&h=200&fit=crop"
                        alt="Panna Cotta aux Fruits Rouges"
                        width={300}
                        height={200}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <h4 className="text-2xl font-bold text-white mb-3">Panna Cotta aux Fruits Rouges</h4>
                    <p className="text-gray-300 leading-relaxed mb-4">
                      Crème onctueuse à la vanille, coulis de fruits rouges et éclats de pistache
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-3xl font-bold text-yellow-400">7,50€</span>
                      <div className="flex space-x-2">
                        <span className="bg-pink-500/20 text-pink-400 px-3 py-1 rounded-full text-sm">🍓 Fruits rouges</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section Café & Boissons Chaudes */}
              <div className="mb-16">
                <h3 className="text-4xl font-bold text-white mb-8 text-center">☕ Café & Boissons Chaudes</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
                  
                  {/* Café 1 */}
                  <div className="group bg-gradient-to-br from-gray-700/80 to-gray-800/80 backdrop-blur-md rounded-2xl p-6 border border-gray-600/50 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/20">
                    <div className="relative overflow-hidden rounded-xl mb-4">
                      <Image
                        src="https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=200&fit=crop"
                        alt="Espresso"
                        width={300}
                        height={200}
                        className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2">Espresso</h4>
                    <p className="text-gray-300 text-sm mb-3">
                      Café serré, arômes intenses
                    </p>
                    <span className="text-2xl font-bold text-yellow-400">2,50€</span>
                  </div>

                  {/* Café 2 */}
                  <div className="group bg-gradient-to-br from-gray-700/80 to-gray-800/80 backdrop-blur-md rounded-2xl p-6 border border-gray-600/50 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/20">
                    <div className="relative overflow-hidden rounded-xl mb-4">
                      <Image
                        src="https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300&h=200&fit=crop"
                        alt="Cappuccino"
                        width={300}
                        height={200}
                        className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2">Cappuccino</h4>
                    <p className="text-gray-300 text-sm mb-3">
                      Espresso, lait moussé, cacao
                    </p>
                    <span className="text-2xl font-bold text-yellow-400">3,50€</span>
                  </div>

                  {/* Café 3 */}
                  <div className="group bg-gradient-to-br from-gray-700/80 to-gray-800/80 backdrop-blur-md rounded-2xl p-6 border border-gray-600/50 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/20">
                    <div className="relative overflow-hidden rounded-xl mb-4">
                      <Image
                        src="https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=300&h=200&fit=crop"
                        alt="Latte Macchiato"
                        width={300}
                        height={200}
                        className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2">Latte Macchiato</h4>
                    <p className="text-gray-300 text-sm mb-3">
                      Lait chaud, espresso, mousse
                    </p>
                    <span className="text-2xl font-bold text-yellow-400">4,00€</span>
                  </div>

                  {/* Café 4 */}
                  <div className="group bg-gradient-to-br from-gray-700/80 to-gray-800/80 backdrop-blur-md rounded-2xl p-6 border border-gray-600/50 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/20">
                    <div className="relative overflow-hidden rounded-xl mb-4">
                      <Image
                        src="https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=300&h=200&fit=crop"
                        alt="Chocolat Chaud"
                        width={300}
                        height={200}
                        className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2">Chocolat Chaud</h4>
                    <p className="text-gray-300 text-sm mb-3">
                      Chocolat noir, chantilly
                    </p>
                    <span className="text-2xl font-bold text-yellow-400">4,50€</span>
                  </div>

                  {/* Thé 1 */}
                  <div className="group bg-gradient-to-br from-gray-700/80 to-gray-800/80 backdrop-blur-md rounded-2xl p-6 border border-gray-600/50 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/20">
                    <div className="relative overflow-hidden rounded-xl mb-4">
                      <Image
                        src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop"
                        alt="Thé Earl Grey"
                        width={300}
                        height={200}
                        className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2">Thé Earl Grey</h4>
                    <p className="text-gray-300 text-sm mb-3">
                      Thé noir bergamote, citron
                    </p>
                    <span className="text-2xl font-bold text-yellow-400">3,00€</span>
                  </div>

                  {/* Thé 2 */}
                  <div className="group bg-gradient-to-br from-gray-700/80 to-gray-800/80 backdrop-blur-md rounded-2xl p-6 border border-gray-600/50 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/20">
                    <div className="relative overflow-hidden rounded-xl mb-4">
                      <Image
                        src="https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300&h=200&fit=crop"
                        alt="Thé Vert Jasmin"
                        width={300}
                        height={200}
                        className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2">Thé Vert Jasmin</h4>
                    <p className="text-gray-300 text-sm mb-3">
                      Thé vert parfumé au jasmin
                    </p>
                    <span className="text-2xl font-bold text-yellow-400">3,20€</span>
                  </div>

                  {/* Infusion 1 */}
                  <div className="group bg-gradient-to-br from-gray-700/80 to-gray-800/80 backdrop-blur-md rounded-2xl p-6 border border-gray-600/50 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/20">
                    <div className="relative overflow-hidden rounded-xl mb-4">
                      <Image
                        src="https://images.unsplash.com/photo-1597318181409-63a3a6de04de?w=300&h=200&fit=crop"
                        alt="Infusion Verveine"
                        width={300}
                        height={200}
                        className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2">Infusion Verveine</h4>
                    <p className="text-gray-300 text-sm mb-3">
                      Tisane relaxante, miel
                    </p>
                    <span className="text-2xl font-bold text-yellow-400">2,80€</span>
                  </div>

                  {/* Café Gourmand */}
                  <div className="group bg-gradient-to-br from-gray-700/80 to-gray-800/80 backdrop-blur-md rounded-2xl p-6 border border-gray-600/50 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/20">
                    <div className="relative overflow-hidden rounded-xl mb-4">
                      <Image
                        src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h=200&fit=crop"
                        alt="Café Gourmand"
                        width={300}
                        height={200}
                        className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2">Café Gourmand</h4>
                    <p className="text-gray-300 text-sm mb-3">
                      Café + mini desserts
                    </p>
                    <span className="text-2xl font-bold text-yellow-400">9,90€</span>
                  </div>
                </div>
              </div>

              {/* Section informations pratiques */}
              <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🧁</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Fait Maison</h3>
                  <p className="text-gray-200">Tous nos desserts sont préparés sur place</p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-brown-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">☕</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Café Premium</h3>
                  <p className="text-gray-200">Grains sélectionnés et torréfiés artisanalement</p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🍯</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Ingrédients Naturels</h3>
                  <p className="text-gray-200">Sucre de canne, miel bio et épices authentiques</p>
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

