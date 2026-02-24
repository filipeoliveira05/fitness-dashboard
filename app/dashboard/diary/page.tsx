"use client";

import { useState } from "react";
import { format, addDays, subDays, isToday } from "date-fns";
import { pt } from "date-fns/locale";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Utensils,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const MEALS = [
  "Pequeno Almoço",
  "Lanche da Manhã",
  "Almoço",
  "Lanche da Tarde",
  "Jantar",
];

export default function DiaryPage() {
  const [date, setDate] = useState<Date>(new Date());
  const [cardio, setCardio] = useState(0);
  const [goal, setGoal] = useState(2000);

  const totalConsumed = 0; // Será calculado com base nas refeições futuramente
  const totalBalance = totalConsumed - cardio;
  const remaining = goal - totalBalance;

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            Diário Alimentar
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Regista as tuas refeições e acompanha os teus macros.
          </p>
        </div>

        {/* Date Picker and Navigation */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setDate(new Date())}
            disabled={isToday(date)}
          >
            Hoje
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setDate(subDays(date, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !date && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? (
                  format(date, "PPP", { locale: pt })
                ) : (
                  <span>Escolhe uma data</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0"></PopoverContent>
          </Popover>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setDate(addDays(date, 1))}
            disabled={isToday(date)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Meal Cards List (Vertical) */}
      <div className="flex flex-col gap-6">
        {MEALS.map((meal) => (
          <div
            key={meal}
            className="flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
          >
            {/* Card Header */}
            <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-800/50">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm dark:bg-zinc-900">
                  <Utensils
                    size={14}
                    className="text-zinc-900 dark:text-zinc-100"
                  />
                </div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                  {meal}
                </h3>
              </div>
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                0 kcal
              </span>
            </div>

            {/* Card Body (Food List) */}
            <div className="flex min-h-[120px] flex-1 flex-col items-center justify-center p-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
              <p>Nenhum alimento registado</p>
            </div>

            {/* Card Footer (Action) */}
            <div className="border-t border-zinc-200 p-3 dark:border-zinc-800">
              <Button
                variant="outline"
                className="w-full justify-center gap-2 border-dashed"
              >
                <Plus size={16} />
                Adicionar Alimento
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Footer */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 pt-6 border-t border-zinc-200 dark:border-zinc-800">
        {/* Total Consumed */}
        <div className="p-4 rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Consumido
          </p>
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            {totalConsumed} kcal
          </p>
        </div>

        {/* Cardio Input */}
        <div className="p-4 rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Cardio (Queimadas)
          </p>
          <div className="flex items-baseline gap-1">
            <input
              type="number"
              value={cardio}
              onChange={(e) => setCardio(Number(e.target.value))}
              className="w-full bg-transparent text-2xl font-bold text-zinc-900 dark:text-zinc-50 focus:outline-none"
              placeholder="0"
            />
            <span className="text-sm text-zinc-500">kcal</span>
          </div>
        </div>

        {/* Total Balance (Net) */}
        <div className="p-4 rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Saldo Total
          </p>
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            {totalBalance} kcal
          </p>
        </div>

        {/* Remaining */}
        <div className="p-4 rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Restante
            </p>
            <span className="text-xs text-zinc-400">Meta: {goal}</span>
          </div>
          <p
            className={`text-2xl font-bold ${remaining < 0 ? "text-red-500" : "text-green-500"}`}
          >
            {remaining} kcal
          </p>
        </div>
      </div>
    </div>
  );
}
