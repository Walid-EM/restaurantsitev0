"use client";
import Image from "next/image";

export default function MenuPage1() {
  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black overflow-hidden relative">
      {/* Éléments décoratifs d'arrière-plan */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500/8 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      
      {/* Contenu principal */}
      <div className="h-full flex flex-col p-4 relative z-10">
        <div className="flex-1 flex flex-col items-center justify-center w-full">
          {/* Section principale du menu */}
          <div className="w-[98%] h-full px-4">
            {/* Conteneur principal */}
            <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-3xl p-6 border border-gray-600/50 shadow-2xl shadow-black/50 relative overflow-hidden h-full flex flex-col">
              
              {/* Titre de la section */}
              <div className="text-center mb-6">
                <h2 className="text-3xl xl:text-4xl font-bold mb-3 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent drop-shadow-lg">
                  Entrées & Salades
                </h2>
                <div className="w-[95%] h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mx-auto animate-pulse"></div>
                <p className="text-lg text-gray-200 mt-3">
                  Commencez votre repas avec nos délicieuses entrées fraîches
                </p>
              </div>

              {/* Grille des produits */}
              <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 overflow-hidden">
                
                {/* Produit 1 */}
                <div className="group bg-gradient-to-br from-gray-700/80 to-gray-800/80 backdrop-blur-md rounded-xl p-4 border border-gray-600/50 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/20 flex flex-col">
                  <div className="relative overflow-hidden rounded-xl mb-3 flex-shrink-0">
                    <Image
                      src="/cheeseburger.png"
                      alt="Salade César"
                      width={300}
                      height={120}
                      className="w-full h-24 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">Salade César</h3>
                      <p className="text-gray-300 text-sm leading-relaxed mb-3">
                        Salade romaine croquante, parmesan, croûtons dorés, filets de poulet grillé
                      </p>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-yellow-400">12,90€</span>
                      <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs">🥗 Frais</span>
                    </div>
                  </div>
                </div>

                {/* Produit 2 */}
                <div className="group bg-gradient-to-br from-gray-700/80 to-gray-800/80 backdrop-blur-md rounded-xl p-4 border border-gray-600/50 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/20 flex flex-col">
                  <div className="relative overflow-hidden rounded-xl mb-3 flex-shrink-0">
                    <Image
                      src="/cheeseburger.png"
                      alt="Salade Méditerranéenne"
                      width={300}
                      height={120}
                      className="w-full h-24 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">Salade Méditerranéenne</h3>
                      <p className="text-gray-300 text-sm leading-relaxed mb-3">
                        Mélange de jeunes pousses, tomates cerises, olives noires, feta grecque
                      </p>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-yellow-400">11,50€</span>
                      <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs">🌱 Végé</span>
                    </div>
                  </div>
                </div>

                {/* Produit 3 */}
                <div className="group bg-gradient-to-br from-gray-700/80 to-gray-800/80 backdrop-blur-md rounded-xl p-4 border border-gray-600/50 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/20 flex flex-col">
                  <div className="relative overflow-hidden rounded-xl mb-3 flex-shrink-0">
                    <Image
                      src="/cheeseburger.png"
                      alt="Salade de Chèvre Chaud"
                      width={300}
                      height={120}
                      className="w-full h-24 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">Salade de Chèvre Chaud</h3>
                      <p className="text-gray-300 text-sm leading-relaxed mb-3">
                        Mélange de salades, crottin de chèvre gratiné sur toast, noix, miel
                      </p>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-yellow-400">13,90€</span>
                      <span className="bg-orange-500/20 text-orange-400 px-2 py-1 rounded-full text-xs">🔥 Chaud</span>
                    </div>
                  </div>
                </div>

                {/* Produit 4 */}
                <div className="group bg-gradient-to-br from-gray-700/80 to-gray-800/80 backdrop-blur-md rounded-xl p-4 border border-gray-600/50 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/20 flex flex-col">
                  <div className="relative overflow-hidden rounded-xl mb-3 flex-shrink-0">
                    <Image
                      src="/cheeseburger.png"
                      alt="Carpaccio de Bœuf"
                      width={300}
                      height={120}
                      className="w-full h-24 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">Carpaccio de Bœuf</h3>
                      <p className="text-gray-300 text-sm leading-relaxed mb-3">
                        Fines lamelles de bœuf cru, roquette, copeaux de parmesan, câpres
                      </p>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-yellow-400">16,90€</span>
                      <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded-full text-xs">⭐ Premium</span>
                    </div>
                  </div>
                </div>

                {/* Produit 5 */}
                <div className="group bg-gradient-to-br from-gray-700/80 to-gray-800/80 backdrop-blur-md rounded-xl p-4 border border-gray-600/50 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/20 flex flex-col">
                  <div className="relative overflow-hidden rounded-xl mb-3 flex-shrink-0">
                    <Image
                      src="/cheeseburger.png"
                      alt="Bruschetta Italienne"
                      width={300}
                      height={120}
                      className="w-full h-24 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">Bruschetta Italienne</h3>
                      <p className="text-gray-300 text-sm leading-relaxed mb-3">
                        Pain grillé à l&apos;ail, tomates fraîches, basilic, mozzarella di buffala
                      </p>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-yellow-400">9,90€</span>
                      <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs">🇮🇹 Italienne</span>
                    </div>
                  </div>
                </div>

                {/* Produit 6 */}
                <div className="group bg-gradient-to-br from-gray-700/80 to-gray-800/80 backdrop-blur-md rounded-xl p-4 border border-gray-600/50 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/20 flex flex-col">
                  <div className="relative overflow-hidden rounded-xl mb-3 flex-shrink-0">
                    <Image
                      src="/cheeseburger.png"
                      alt="Salade de Saumon Fumé"
                      width={300}
                      height={120}
                      className="w-full h-24 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">Salade de Saumon Fumé</h3>
                      <p className="text-gray-300 text-sm leading-relaxed mb-3">
                        Saumon fumé d&apos;Écosse, avocat, aneth frais, crème à l&apos;échalote
                      </p>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-yellow-400">15,90€</span>
                      <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-xs">🐟 Poisson</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}