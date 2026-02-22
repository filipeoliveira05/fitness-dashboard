"use client";

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      {/* Aqui poderás adicionar uma Navbar ou Sidebar comum a toda a dashboard */}
      <nav className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <span className="font-bold text-xl">Dashboard</span>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              router.push("/");
            }}
            className="text-sm text-red-500 hover:text-red-600"
          >
            Sair
          </button>
        </div>
      </nav>
      <main className="p-6 max-w-7xl mx-auto">{children}</main>
    </div>
  );
}
