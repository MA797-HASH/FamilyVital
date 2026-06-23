"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Reminder = {
  id: string;
  user_id: string;
  title: string;
  time: string;
  repeat: string;
  category: string;
  done: boolean;
  created_at: string;
};

const PLACEHOLDER_USER_ID = "00000000-0000-0000-0000-000000000000";

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);

  // Formulaire
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [repeat, setRepeat] = useState("none");
  const [category, setCategory] = useState("general");

  // 1. Charger tous les reminders sans filtre user
  useEffect(() => {
    const init = async () => {
      const { data, error } = await supabase
        .from("reminders")
        .select("*")
        .order("created_at", { ascending: true });

      if (!error && data) setReminders(data as Reminder[]);
      setLoading(false);
    };
    init();
  }, []);

  // 2. Ajouter un reminder dans Supabase
  const handleAdd = async () => {
    if (!title.trim()) return;

    const newReminder = {
      user_id: PLACEHOLDER_USER_ID,
      title: title.trim(),
      time,
      repeat,
      category,
      done: false,
    };

    const { data, error } = await supabase
      .from("reminders")
      .insert(newReminder)
      .select()
      .single();

    if (!error && data) {
      setReminders((prev) => [...prev, data as Reminder]);
      setTitle("");
      setTime("");
      setRepeat("none");
      setCategory("general");
    } else {
      console.error("Erreur ajout reminder:", error);
    }
  };

  // 3. Cocher/décocher → update done dans Supabase
  const handleToggle = async (id: string, currentDone: boolean) => {
    const { error } = await supabase
      .from("reminders")
      .update({ done: !currentDone })
      .eq("id", id);

    if (!error) {
      setReminders((prev) =>
        prev.map((r) => (r.id === id ? { ...r, done: !currentDone } : r))
      );
    } else {
      console.error("Erreur toggle reminder:", error);
    }
  };

  if (loading) return <div className="p-6">Chargement des reminders...</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Reminders & Goals</h1>

      {/* Formulaire ajout */}
      <div className="bg-white rounded-xl shadow p-4 mb-6 space-y-3">
        <h2 className="font-semibold text-lg">Nouveau reminder</h2>

        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Titre (ex: Prendre médicament)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="time"
          className="w-full border rounded px-3 py-2"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />

        <select
          className="w-full border rounded px-3 py-2"
          value={repeat}
          onChange={(e) => setRepeat(e.target.value)}
        >
          <option value="none">Pas de répétition</option>
          <option value="daily">Quotidien</option>
          <option value="weekly">Hebdomadaire</option>
        </select>

        <select
          className="w-full border rounded px-3 py-2"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="general">Général</option>
          <option value="medication">Médicament</option>
          <option value="exercise">Exercice</option>
          <option value="nutrition">Nutrition</option>
          <option value="appointment">Rendez-vous</option>
        </select>

        <button
          onClick={handleAdd}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Ajouter
        </button>
      </div>

      {/* Liste des reminders */}
      <div className="space-y-3">
        {reminders.length === 0 ? (
          <p className="text-gray-500 text-center">Aucun reminder pour l'instant.</p>
        ) : (
          reminders.map((r) => (
            <div
              key={r.id}
              className={`flex items-center gap-3 bg-white rounded-xl shadow p-4 ${
                r.done ? "opacity-50" : ""
              }`}
            >
              <input
                type="checkbox"
                checked={r.done}
                onChange={() => handleToggle(r.id, r.done)}
                className="w-5 h-5 cursor-pointer"
              />
              <div className="flex-1">
                <p className={`font-medium ${r.done ? "line-through" : ""}`}>
                  {r.title}
                </p>
                <p className="text-sm text-gray-500">
                  {r.time && `🕐 ${r.time}`} {r.category && `· ${r.category}`} {r.repeat !== "none" && `· ${r.repeat}`}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
