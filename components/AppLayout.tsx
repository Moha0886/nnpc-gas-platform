"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/contexts/AuthContext";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  // Public routes that don't require authentication
  const publicRoutes = ["/login"];
  const isPublicRoute = publicRoutes.includes(pathname);

  useEffect(() => {
    // Redirect to login if not authenticated and not on a public route
    if (!isLoading && !isAuthenticated && !isPublicRoute) {
      router.push("/login");
    }

    // Redirect to dashboard if authenticated and on login page
    if (!isLoading && isAuthenticated && pathname === "/login") {
      router.push("/");
    }
  }, [isAuthenticated, isLoading, pathname, isPublicRoute, router]);

  // Show loading screen during auth check
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto"></div>
          <p className="text-ink/70 mt-4 text-lg">Loading NNPC Gas Platform...</p>
        </div>
      </div>
    );
  }

  // Don't show sidebar on public routes
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // Show sidebar for authenticated routes
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto w-full lg:w-auto">
        <div className="pt-16 lg:pt-0">{children}</div>
      </main>
    </div>
  );
}
