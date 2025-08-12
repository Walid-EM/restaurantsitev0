'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface AdminProtectedProps {
  children: React.ReactNode;
}

export default function AdminProtected({ children }: AdminProtectedProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  // ✅ Redirection immédiate si pas autorisé
  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session || session.user.role !== 'admin') {
      console.log("🔒 Accès non autorisé, redirection immédiate");
      router.replace('/admin/login');
    }
  }, [session, status, router]);

  // ✅ Afficher un écran de chargement pendant la vérification
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Vérification de l&apos;authentification...</div>
      </div>
    );
  }

  // ✅ BLOQUER COMPLÈTEMENT si pas autorisé (pas de contenu visible)
  if (!session || session.user.role !== 'admin') {
    // ✅ Redirection en cours, ne rien afficher
    return null;
  }

  // ✅ Afficher le contenu SEULEMENT si autorisé
  return <>{children}</>;
}
