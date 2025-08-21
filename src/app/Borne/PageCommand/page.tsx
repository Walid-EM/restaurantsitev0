'use client';

import MainPageCommand1 from "@/components/ui/MainPageCommand1";
import Footer from "@/components/ui/Footer";
import { CartProvider } from "@/components/ui/CartProvider";

export default function ClientBCommandPage() {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow"> 
          {/* MainPageCommand1 charge maintenant ses données directement depuis MongoDB */}
          <MainPageCommand1 />
        </main>

        <Footer />
      </div>
    </CartProvider>
  );
}