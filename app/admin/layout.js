"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { AdminProvider, useAdmin } from "@/lib/admin/adminStore";
import AdminSidebar from "@/components/admin/ui/AdminSidebar";
import AdminHeader from "@/components/admin/ui/AdminHeader";
import AdminToast from "@/components/admin/ui/AdminToast";

// Code optimization: Lazily load heavy interactive modals only on the client
const QuickPosModal = dynamic(
  () => import("@/components/admin/ui/QuickPosModal"),
  { ssr: false }
);

function AdminAuthGuard({ children }) {
  const { currentUser, isAuthLoading } = useAdmin();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthLoading && !currentUser) {
      router.push("/admin/login");
    }
  }, [currentUser, isAuthLoading, router]);

  if (isAuthLoading) {
    return (
      <div className="min-h-screen w-full bg-[#0A0908] flex flex-col items-center justify-center p-4">
        <div className="w-9 h-9 border-2 border-gold/20 border-t-gold rounded-full animate-spin mb-3" />
        <p className="text-xs font-mono text-[#8E867B] tracking-wider uppercase">
          Verifying security session...
        </p>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  return children;
}

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return (
      <AdminProvider>
        <div className="admin-scope">
          {children}
          <AdminToast />
        </div>
      </AdminProvider>
    );
  }

  return (
    <AdminProvider>
      <AdminAuthGuard>
        <div className="min-h-screen bg-[#0A0908] text-[#EDE8E1] flex flex-row admin-scope">
          {/* Persistent Responsive Sidebar */}
          <AdminSidebar />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0">
            <AdminHeader />
            <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
              {children}
            </main>
          </div>

          {/* Global Floating Modals & Tools */}
          <QuickPosModal />
          <AdminToast />
        </div>
      </AdminAuthGuard>
    </AdminProvider>
  );
}
