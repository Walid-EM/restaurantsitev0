import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdmin = token?.role === "admin";
    const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
    const isSetupRoute = req.nextUrl.pathname === "/admin/setup";
    const isLoginRoute = req.nextUrl.pathname === "/admin/login";

    // ✅ Log pour déboguer
    console.log("🔒 Middleware exécuté:", {
      path: req.nextUrl.pathname,
      hasToken: !!token,
      tokenRole: token?.role,
      isAdmin,
      isAdminRoute
    });

    // Si c'est la route setup ou login, laisser passer
    if (isSetupRoute || isLoginRoute) {
      console.log("✅ Route setup/login autorisée");
      return NextResponse.next();
    }

    // Si c'est une route admin et que l'utilisateur n'est pas admin
    if (isAdminRoute && !isAdmin) {
      console.log("❌ Accès refusé, redirection vers login");
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    console.log("✅ Accès autorisé");
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // ✅ Log pour déboguer
        console.log("🔐 Callback authorized:", {
          path: req.nextUrl.pathname,
          hasToken: !!token,
          tokenRole: token?.role
        });

        // Toujours autoriser setup et login
        if (req.nextUrl.pathname === "/admin/setup" || req.nextUrl.pathname === "/admin/login") {
          return true;
        }
        
        // Pour les autres routes admin, vérifier le token ET le rôle admin
        if (req.nextUrl.pathname.startsWith("/admin")) {
          return !!token && token.role === "admin";
        }
        
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*"],
};
