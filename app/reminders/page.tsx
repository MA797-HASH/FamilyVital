"use client";

import { type CSSProperties, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

  const router = useRouter();

  // Formulaire
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [repeat, setRepeat] = useState("none");
  const [category, setCategory] = useState("general");

  useEffect(() => {
    const validateAuth = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        router.push("/login");
      }
    };
    validateAuth();
  }, [router]);

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

  const pageStyle: CSSProperties = {
    backgroundColor: "#f8fafc",
    minHeight: "100vh",
    padding: "2rem 1rem",
  };

  const containerStyle: CSSProperties = {
    maxWidth: "980px",
    margin: "0 auto",
    padding: "0 0.5rem",
  };

  const headerStyle: CSSProperties = {
    marginBottom: "1.75rem",
    color: "#0f172a",
  };

  const heroStyle: CSSProperties = {
    backgroundColor: "#ffffff",
    borderRadius: "28px",
    border: "1px solid rgba(148, 163, 184, 0.16)",
    boxShadow: "0 24px 64px rgba(15, 23, 42, 0.08)",
    padding: "2rem",
    marginBottom: "1.5rem",
  };

  const formCardStyle: CSSProperties = {
    backgroundColor: "#ffffff",
    borderRadius: "28px",
    border: "1px solid rgba(148, 163, 184, 0.16)",
    boxShadow: "0 24px 64px rgba(15, 23, 42, 0.08)",
    padding: "2rem",
    marginBottom: "1.5rem",
  };

  const sectionTitleStyle: CSSProperties = {
    margin: 0,
    fontSize: "1.4rem",
    fontWeight: 800,
    color: "#0f172a",
  };

  const sectionTextStyle: CSSProperties = {
    marginTop: "0.65rem",
    color: "#475569",
    fontSize: "1rem",
    lineHeight: 1.75,
  };

  const inputStyle: CSSProperties = {
    width: "100%",
    border: "1px solid #e2e8f0",
    borderRadius: "1rem",
    padding: "0.95rem 1rem",
    fontSize: "1rem",
    color: "#0f172a",
    backgroundColor: "#ffffff",
  };

  const labelStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    color: "#334155",
    fontWeight: 700,
    fontSize: "0.95rem",
  };

  const primaryButtonStyle = {
    width: "100%",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    border: "none",
    borderRadius: "1rem",
    padding: "1rem 1.1rem",
    fontSize: "1rem",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 16px 32px rgba(37, 99, 235, 0.18)",
  };

  const reminderGridStyle: CSSProperties = {
    display: "grid",
    gap: "1rem",
  };

  const reminderCardStyle: CSSProperties = {
    backgroundColor: "#ffffff",
    borderRadius: "24px",
    boxShadow: "0 18px 40px rgba(15, 23, 42, 0.08)",
    border: "1px solid rgba(148, 163, 184, 0.16)",
    padding: "1.35rem",
    display: "grid",
    gridTemplateColumns: "minmax(170px, 210px) 1fr auto",
    gap: "1rem",
    alignItems: "center",
  };

  const reminderTitleStyle = {
    margin: 0,
    fontSize: "1rem",
    fontWeight: 700,
    color: "#0f172a",
  };

  const reminderMetaStyle = {
    marginTop: "0.45rem",
    fontSize: "0.95rem",
    color: "#64748b",
    lineHeight: 1.5,
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
          <p style={{ marginTop: "0.75rem", color: "#475569", fontSize: "1rem", maxWidth: "780px" }}>
            Keep your family on track with clean reminders, goals, and daily habits.
          </p>
        </div>

        <div style={heroStyle}>
          <p style={{ margin: 0, color: "#2563eb", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", fontSize: "0.85rem" }}>
            Health routine
          </p>
          <h2 style={{ margin: "0.75rem 0 0", fontSize: "2rem", fontWeight: 800, color: "#0f172a", lineHeight: 1.05 }}>
            Manage reminders with a modern health dashboard feel.
          </h2>
          <p style={sectionTextStyle}>
            Add new tasks, schedule reminders, and stay organized with crisp cards, shadows, and consistent spacing.
          </p>
        </div>

        <div style={formCardStyle}>
          <div style={{ marginBottom: "1.5rem" }}>
            <h3 style={sectionTitleStyle}>Add a new reminder</h3>
            <p style={sectionTextStyle}>
              Fill out the form and save reminders for your family’s wellness routine.
            </p>
          </div>

          <div style={{ display: "grid", gap: "1rem" }}>
            <label style={labelStyle}>
              Titre
              <input
                style={inputStyle}
                placeholder="Titre (ex: Prendre médicament)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>

            <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
              <label style={labelStyle}>
                Heure
                <input type="time" style={inputStyle} value={time} onChange={(e) => setTime(e.target.value)} />
              </label>
              <label style={labelStyle}>
                Répétition
                <select style={inputStyle} value={repeat} onChange={(e) => setRepeat(e.target.value)}>
                  <option value="none">Pas de répétition</option>
                  <option value="daily">Quotidien</option>
                  <option value="weekly">Hebdomadaire</option>
                </select>
              </label>
            </div>

            <label style={labelStyle}>
              Catégorie
              <select style={inputStyle} value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="general">Général</option>
                <option value="medication">Médicament</option>
                <option value="exercise">Exercice</option>
                <option value="nutrition">Nutrition</option>
                <option value="appointment">Rendez-vous</option>
              </select>
            </label>

            <button onClick={handleAdd} style={primaryButtonStyle}>
              Ajouter
            </button>
          </div>
        </div>

        <div style={reminderGridStyle}>
          {reminders.length === 0 ? (
            <div style={{ ...heroStyle, textAlign: "center" }}>
              <p style={{ margin: 0, color: "#64748b", fontSize: "1rem" }}>Aucun reminder pour l'instant.</p>
            </div>
          ) : (
            reminders.map((r) => (
              <div key={r.id} style={{ ...reminderCardStyle, opacity: r.done ? 0.65 : 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                  <input
                    type="checkbox"
                    checked={r.done}
                    onChange={() => handleToggle(r.id, r.done)}
                    style={{ width: "1.1rem", height: "1.1rem", accentColor: "#2563eb", cursor: "pointer" }}
                  />
                  <div>
                    <p style={{ margin: 0, fontSize: "0.95rem", fontWeight: 700, color: "#334155" }}>
                      {r.time || "Any time"}
                    </p>
                    <p style={{ margin: "0.35rem 0 0", fontSize: "0.85rem", color: "#64748b" }}>
                      {r.repeat !== "none" ? `${r.repeat} · ` : ""}
                      {formatCategory(r.category)}
                    </p>
                  </div>
                </div>

                <div>
                  <p style={{ ...reminderTitleStyle, textDecoration: r.done ? "line-through" : "none" }}>{r.title}</p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.75rem" }}>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "999px",
                      padding: "0.5rem 0.85rem",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      ...badgeStyle[r.category as keyof typeof badgeStyle],
                    }}
                  >
                    {formatCategory(r.category)}
                  </span>
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
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
