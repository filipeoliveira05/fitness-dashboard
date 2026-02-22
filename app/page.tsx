import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 dark:bg-black p-6 text-center font-sans">
      <h1 className="text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-7xl mb-6">
        Fitness Dashboard
      </h1>
      <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mb-10">
        A ferramenta definitiva para controlares a tua dieta e treinos. Simples,
        rápida e eficiente.
      </p>

      <div className="flex gap-4">
        <Link
          href="/login"
          className="bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 px-8 py-3 rounded-full font-medium hover:opacity-90 transition-opacity"
        >
          Entrar
        </Link>
        <Link
          href="/signup"
          className="flex items-center gap-2 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-50 px-8 py-3 rounded-full font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
        >
          Criar Conta <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}
