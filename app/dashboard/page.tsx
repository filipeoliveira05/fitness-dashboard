import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
        Visão Geral
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/dashboard/foods"
          className="block p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 transition-colors"
        >
          <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
            Gerir Alimentos <ArrowRight size={18} />
          </h3>
          <p className="text-zinc-500">
            Adiciona ou edita alimentos na tua base de dados.
          </p>
        </Link>

        {/* Futuro link para o diário */}
        <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 opacity-50 cursor-not-allowed">
          <h3 className="text-xl font-semibold mb-2">Diário Alimentar</h3>
          <p className="text-zinc-500">Em breve...</p>
        </div>
      </div>
    </div>
  );
}
