"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Pencil, Trash2, Loader2, X, Search, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type Food = {
  id: string;
  name: string;
  calories_per_100g: number;
  protein_per_100g: number;
  carbs_per_100g: number;
  fats_per_100g: number;
  category: string;
};

const CATEGORIES = [
  "Carne",
  "Peixe",
  "Acompanhamentos",
  "Snacks",
  "Pequeno-almoço",
  "Fruta/Vegetais",
  "Doces",
  "Outros",
];

export default function FoodsPage() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState<Food | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    calories: "",
    protein: "",
    carbs: "",
    fats: "",
    category: "Outros",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchFoods();
  }, []);

  async function fetchFoods() {
    setLoading(true);
    const { data, error } = await supabase
      .from("foods")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      toast.error("Erro ao carregar alimentos.");
      console.error(error);
    } else {
      setFoods(data || []);
    }
    setLoading(false);
  }

  const handleOpenModal = (food?: Food) => {
    if (food) {
      setEditingFood(food);
      setFormData({
        name: food.name,
        calories: food.calories_per_100g.toString(),
        protein: food.protein_per_100g.toString(),
        carbs: (food.carbs_per_100g || 0).toString(),
        fats: (food.fats_per_100g || 0).toString(),
        category: food.category || "Outros",
      });
    } else {
      setEditingFood(null);
      setFormData({
        name: "",
        calories: "",
        protein: "",
        carbs: "",
        fats: "",
        category: "Outros",
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error("Precisas de estar autenticado.");
      setSaving(false);
      return;
    }

    const payload = {
      user_id: user.id,
      name: formData.name,
      calories_per_100g: parseFloat(formData.calories) || 0,
      protein_per_100g: parseFloat(formData.protein) || 0,
      carbs_per_100g: parseFloat(formData.carbs) || 0,
      fats_per_100g: parseFloat(formData.fats) || 0,
      category: formData.category,
    };

    let error;

    if (editingFood) {
      const { error: updateError } = await supabase
        .from("foods")
        .update(payload)
        .eq("id", editingFood.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from("foods")
        .insert([payload]);
      error = insertError;
    }

    if (error) {
      toast.error(`Erro ao guardar: ${error.message}`);
      console.error(error);
    } else {
      toast.success(editingFood ? "Alimento atualizado!" : "Alimento criado!");
      setIsModalOpen(false);
      fetchFoods();
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tens a certeza que queres apagar este alimento?")) return;

    const { error } = await supabase.from("foods").delete().eq("id", id);

    if (error) {
      toast.error("Erro ao apagar alimento.");
    } else {
      toast.success("Alimento apagado.");
      setFoods(foods.filter((f) => f.id !== id));
    }
  };

  // Group foods by category
  const filteredFoods = foods.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase()),
  );

  const groupedFoods = CATEGORIES.reduce(
    (acc, category) => {
      acc[category] = filteredFoods.filter(
        (f) => (f.category || "Outros") === category,
      );
      return acc;
    },
    {} as Record<string, Food[]>,
  );

  // Handle "Outros" or undefined categories that might not be in the list
  const otherFoods = filteredFoods.filter(
    (f) => !CATEGORIES.includes(f.category || "Outros"),
  );
  if (otherFoods.length > 0) {
    if (!groupedFoods["Outros"]) groupedFoods["Outros"] = [];
    groupedFoods["Outros"].push(...otherFoods);
  }

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            Meus Alimentos
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Gere a tua base de dados de alimentos e macros.
          </p>
        </div>
        <Button onClick={() => handleOpenModal()} className="gap-2">
          <Plus size={18} /> Novo Alimento
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
          size={18}
        />
        <input
          type="text"
          placeholder="Pesquisar alimentos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-500"
        />
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-zinc-400" size={32} />
        </div>
      ) : (
        <div className="space-y-8">
          {CATEGORIES.map((category) => {
            const categoryFoods = groupedFoods[category];
            if (!categoryFoods || categoryFoods.length === 0) return null;

            return (
              <div key={category} className="space-y-3">
                <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200 px-1">
                  {category}
                </h2>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {categoryFoods.map((food) => (
                    <div
                      key={food.id}
                      className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors group"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-zinc-900 dark:text-zinc-100 truncate pr-2">
                          {food.name}
                        </h3>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleOpenModal(food)}
                            className="p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(food.id)}
                            className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                        <div className="flex flex-col">
                          <span className="font-bold text-zinc-900 dark:text-zinc-200">
                            {food.calories_per_100g}
                          </span>
                          <span>kcal</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-zinc-900 dark:text-zinc-200">
                            {food.protein_per_100g}g
                          </span>
                          <span>Prot</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-zinc-900 dark:text-zinc-200">
                            {food.carbs_per_100g || 0}g
                          </span>
                          <span>Hidr</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-zinc-900 dark:text-zinc-200">
                            {food.fats_per_100g || 0}g
                          </span>
                          <span>Gord</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {filteredFoods.length === 0 && (
            <div className="text-center py-12 text-zinc-500">
              Nenhum alimento encontrado.
            </div>
          )}
        </div>
      )}

      {/* Modal (Simple Overlay) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-4 border-b border-zinc-200 dark:border-zinc-800">
              <h3 className="font-semibold text-lg">
                {editingFood ? "Editar Alimento" : "Novo Alimento"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nome</label>
                <input
                  required
                  type="text"
                  className="w-full px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Categoria
                </label>
                <select
                  className="w-full px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent dark:bg-zinc-900"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Calorias (100g)
                  </label>
                  <input
                    required
                    type="number"
                    step="0.1"
                    className="w-full px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent"
                    value={formData.calories}
                    onChange={(e) =>
                      setFormData({ ...formData, calories: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Proteína (g)
                  </label>
                  <input
                    required
                    type="number"
                    step="0.1"
                    className="w-full px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent"
                    value={formData.protein}
                    onChange={(e) =>
                      setFormData({ ...formData, protein: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Hidratos (g)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    className="w-full px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent"
                    value={formData.carbs}
                    onChange={(e) =>
                      setFormData({ ...formData, carbs: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Gordura (g)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    className="w-full px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent"
                    value={formData.fats}
                    onChange={(e) =>
                      setFormData({ ...formData, fats: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button type="submit" className="w-full" disabled={saving}>
                  {saving ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <>
                      <Save size={18} className="mr-2" /> Guardar
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
