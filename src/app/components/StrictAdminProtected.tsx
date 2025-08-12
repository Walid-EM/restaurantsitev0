'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

interface StrictAdminProtectedProps {
  children: React.ReactNode;
}

export default function StrictAdminProtected({ children }: StrictAdminProtectedProps) {
  const { data: session, status } = useSession();

  useEffect(() => {
    // ✅ Redirection IMMÉDIATE et FORCÉE si pas autorisé
    if (status === 'loading') return;
    
    if (!session || session.user.role !== 'admin') {
      console.log("🚨 Accès non autorisé, redirection FORCÉE");
      // ✅ Déconnexion COMPLÈTE et redirection
      handleSecureLogout();
      return;
    }
  }, [session, status]);

  // ✅ Fonction de déconnexion sécurisée
  const handleSecureLogout = async () => {
    try {
      // 1. Déconnexion sécurisée via notre API
      await fetch('/api/auth/secure-signout', { method: 'POST' });
      
      // 2. Nettoyage complet du navigateur
      localStorage.clear();
      sessionStorage.clear();
      
      // 3. Suppression des cookies NextAuth
      document.cookie.split(";").forEach(function(c) { 
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
      });
      
      // 4. Redirection forcée
      window.location.href = '/admin/login';
    } catch (error) {
      console.error("Erreur lors de la déconnexion sécurisée:", error);
      // Fallback : redirection directe
      window.location.href = '/admin/login';
    }
  };

  // ✅ Afficher un écran de chargement pendant la vérification
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Vérification de l&apos;authentification...</div>
      </div>
    );
  }

  // ✅ BLOQUER COMPLÈTEMENT si pas autorisé
  if (!session || session.user.role !== 'admin') {
    // ✅ Ne rien afficher du tout pendant la redirection
    return null;
  }

  // ✅ Afficher le contenu SEULEMENT si autorisé
  return <>{children}</>;
}
