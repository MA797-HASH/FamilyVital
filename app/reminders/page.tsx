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

  // 4. Supprimer un reminder
  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("reminders").delete().eq("id", id);
    if (!error) {
      setReminders((prev) => prev.filter((r) => r.id !== id));
    } else {
      console.error("Erreur suppression reminder:", error);
    }
  };

  const pageStyle = {
    backgroundColor: "#f8fafc",
    minHeight: "100vh",
    padding: "2rem 1rem",
  };

  const containerStyle = {
    maxWidth: "960px",
    margin: "0 auto",
    padding: "0 0.5rem",
  };

  const headerStyle = {
    marginBottom: "1.5rem",
    color: "#0f172a",
  };

  const panelStyle = {
    backgroundColor: "#ffffff",
    borderRadius: "28px",
    boxShadow: "0 24px 64px rgba(15, 23, 42, 0.08)",
    border: "1px solid rgba(148, 163, 184, 0.16)",
    padding: "1.75rem",
    marginBottom: "1.5rem",
  };

  const inputStyle = {
    width: "100%",
    border: "1px solid #e2e8f0",
    borderRadius: "0.9rem",
    padding: "0.95rem 1rem",
    fontSize: "0.96rem",
    color: "#0f172a",
    backgroundColor: "#ffffff",
  };

  const primaryButtonStyle = {
    width: "100%",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    border: "none",
    borderRadius: "0.9rem",
    padding: "0.95rem 1rem",
    fontSize: "1rem",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 12px 24px rgba(37, 99, 235, 0.18)",
  };

  const reminderCardStyle = {
    backgroundColor: "#ffffff",
    borderRadius: "1.5rem",
    boxShadow: "0 18px 40px rgba(15, 23, 42, 0.08)",
    border: "1px solid rgba(148, 163, 184, 0.16)",
    padding: "1.25rem",
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  };

  const badgeStyle = {
    general: { backgroundColor: "#e0f2fe", color: "#0369a1" },
    medication: { backgroundColor: "#ede9fe", color: "#7c3aed" },
    exercise: { backgroundColor: "#d1fae5", color: "#047857" },
    nutrition: { backgroundColor: "#cffafe", color: "#0c4a6e" },
    appointment: { backgroundColor: "#fef3c7", color: "#b45309" },
  };

  const formatCategory = (cat: string) => {
    switch (cat) {
      case "medication":
        return "Médicament";
      case "exercise":
        return "Exercice";
      case "nutrition":
        return "Nutrition";
      case "appointment":
        return "Rendez-vous";
      default:
        return "Général";
    }
  };

  if (loading) return <div className="p-6">Chargement des reminders...</div>;

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <div style={headerStyle}>
          <h1 style={{ fontSize: "2.2rem", fontWeight: 800, margin: 0 }}>Reminders & Goals</h1>
          <p style={{ marginTop: "0.75rem", color: "#475569", fontSize: "1rem", maxWidth: "720px" }}>
            Keep your family on track with clean reminders, goals, and daily habits.
          </p>
        </div>

        <div style={panelStyle}>
          <div style={{ marginBottom: "1.25rem" }}>
            <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700, color: "#0f172a" }}>Add a new reminder</h2>
            <p style={{ marginTop: "0.5rem", color: "#64748b", fontSize: "0.95rem" }}>
              Create a task for your family’s health routine with a time, repetition, and category.
            </p>
          </div>

          <div style={{ display: "grid", gap: "1rem" }}>
            <input
              style={inputStyle}
              placeholder="Titre (ex: Prendre médicament)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <input
              type="time"
              style={inputStyle}
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />

            <select style={inputStyle} value={repeat} onChange={(e) => setRepeat(e.target.value)}>
              <option value="none">Pas de répétition</option>
              <option value="daily">Quotidien</option>
              <option value="weekly">Hebdomadaire</option>
            </select>

            <select style={inputStyle} value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="general">Général</option>
              <option value="medication">Médicament</option>
              <option value="exercise">Exercice</option>
              <option value="nutrition">Nutrition</option>
              <option value="appointment">Rendez-vous</option>
            </select>

            <button onClick={handleAdd} style={primaryButtonStyle}>
              Ajouter
            </button>
          </div>
        </div>

        <div style={{ display: "grid", gap: "1rem" }}>
          {reminders.length === 0 ? (
            <div style={{ ...panelStyle, textAlign: "center" }}>
              <p style={{ margin: 0, color: "#64748b", fontSize: "1rem" }}>Aucun reminder pour l'instant.</p>
            </div>
          ) : (
            reminders.map((r) => (
              <div key={r.id} style={{ ...reminderCardStyle, opacity: r.done ? 0.65 : 1 }}>
                <label style={{ display: "flex", alignItems: "center", gap: "0.85rem", minWidth: "170px" }}>
                  <input
                    type="checkbox"
                    checked={r.done}
                    onChange={() => handleToggle(r.id, r.done)}
                    style={{ width: "1.1rem", height: "1.1rem", accentColor: "#2563eb", cursor: "pointer" }}
                  />
                  <span style={{ fontSize: "0.95rem", color: "#334155", fontWeight: 600 }}>
                    {r.time || "Any time"}
                  </span>
                </label>

                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "#0f172a", textDecoration: r.done ? "line-through" : "none" }}>
                    {r.title}
                  </p>
                  <p style={{ marginTop: "0.45rem", fontSize: "0.95rem", color: "#64748b" }}>
                    {r.repeat !== "none" ? `${r.repeat} · ` : ""}
                    {formatCategory(r.category)}
                  </p>
                </div>

                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "999px",
                    padding: "0.45rem 0.75rem",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    ...badgeStyle[r.category as keyof typeof badgeStyle],
                  }}
                >
                  {formatCategory(r.category)}
                </div>

                <button
                  onClick={() => handleDelete(r.id)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#ef4444",
                    cursor: "pointer",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                  }}
                >
                  Supprimer
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
