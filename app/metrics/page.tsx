"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type FamilyMember = {
  id: string;
  name: string;
};

export default function MetricsPage() {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [steps, setSteps] = useState("");
  const [sleepHours, setSleepHours] = useState("");
  const [waterGlasses, setWaterGlasses] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchMembers = async () => {
      const { data, error } = await supabase
        .from("family_members")
        .select("id,name")
        .order("name", { ascending: true });

      if (error) {
        console.error("Erreur récupération des membres:", error);
      } else if (data) {
        setFamilyMembers(data as FamilyMember[]);
        if (data.length > 0) {
          setSelectedMemberId((data as FamilyMember[])[0].id);
        }
      }
      setLoading(false);
    };

    fetchMembers();
  }, []);

  const handleSave = async () => {
    setMessage("");

    if (!selectedMemberId) {
      setMessage("Veuillez choisir un membre de la famille.");
      return;
    }

    const parsedSteps = parseInt(steps, 10);
    const parsedSleep = parseFloat(sleepHours);
    const parsedWater = parseInt(waterGlasses, 10);

    if (Number.isNaN(parsedSteps) || Number.isNaN(parsedSleep) || Number.isNaN(parsedWater)) {
      setMessage("Veuillez saisir des valeurs valides pour les pas, le sommeil et l'eau.");
      return;
    }

    setSaving(true);

    const { error } = await supabase.from("health_metrics").insert({
      family_member_id: selectedMemberId,
      steps: parsedSteps,
      sleep_hours: parsedSleep,
      water_glasses: parsedWater,
      date: new Date().toISOString().slice(0, 10),
    });

    setSaving(false);

    if (error) {
      console.error("Erreur sauvegarde métriques:", error);
      setMessage("Impossible d'enregistrer les métriques. Réessayez plus tard.");
    } else {
      setMessage("Métriques enregistrées avec succès !");
      setSteps("");
      setSleepHours("");
      setWaterGlasses("");
    }
  };

  const pageStyle = {
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
    padding: "2rem 1rem",
  };

  const containerStyle = {
    maxWidth: "960px",
    margin: "0 auto",
  };

  const heroCardStyle = {
    backgroundColor: "#ffffff",
    borderRadius: "28px",
    border: "1px solid rgba(148, 163, 184, 0.16)",
    boxShadow: "0 24px 64px rgba(15, 23, 42, 0.08)",
    padding: "2rem",
    marginBottom: "1.5rem",
  };

  const formCardStyle = {
    backgroundColor: "#ffffff",
    borderRadius: "28px",
    border: "1px solid rgba(148, 163, 184, 0.16)",
    boxShadow: "0 24px 64px rgba(15, 23, 42, 0.08)",
    padding: "2rem",
  };

  const labelStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "0.6rem",
    color: "#334155",
    fontWeight: 600,
  };

  const inputStyle = {
    width: "100%",
    borderRadius: "1rem",
    border: "1px solid #e2e8f0",
    padding: "0.95rem 1rem",
    fontSize: "1rem",
    color: "#0f172a",
    backgroundColor: "#ffffff",
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
    cursor: saving ? "not-allowed" : "pointer",
    opacity: saving ? 0.8 : 1,
    boxShadow: "0 16px 32px rgba(37, 99, 235, 0.18)",
  };

  const summaryGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "1rem",
    marginTop: "1.5rem",
  };

  const summaryCardStyle = {
    borderRadius: "22px",
    padding: "1.4rem",
    color: "#ffffff",
    minHeight: "140px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    boxShadow: "0 16px 32px rgba(15, 23, 42, 0.12)",
  };

  const summaryLabelStyle = {
    fontSize: "0.95rem",
    opacity: 0.92,
  };

  const summaryValueStyle = {
    fontSize: "2rem",
    fontWeight: 800,
    marginTop: "0.7rem",
    lineHeight: 1,
  };

  const summaryTextStyle = {
    color: "#475569",
    marginTop: "0.75rem",
    lineHeight: 1.7,
    fontSize: "1rem",
  };

  if (loading) {
    return (
      <div style={pageStyle}>
        <div
          style={{
            width: "100%",
            maxWidth: "680px",
            margin: "0 auto",
            backgroundColor: "#ffffff",
            borderRadius: "1.5rem",
            border: "1px solid rgba(148, 163, 184, 0.16)",
            boxShadow: "0 24px 64px rgba(15, 23, 42, 0.08)",
            padding: "2rem",
          }}
        >
          <p style={{ margin: 0, color: "#334155", fontSize: "1rem" }}>Chargement des membres de la famille...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <div style={heroCardStyle}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <p style={{ margin: 0, color: "#2563eb", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", fontSize: "0.85rem" }}>
                Daily metrics
              </p>
              <h1 style={{ margin: "0.6rem 0 0", fontSize: "2.45rem", fontWeight: 800, color: "#0f172a", lineHeight: 1.05 }}>
                Report health progress for your family
              </h1>
              <p style={summaryTextStyle}>
                Log steps, sleep, and water intake for each family member. Keep the day organized with quick targets and a clean tracking experience.
              </p>
            </div>

            <div style={summaryGridStyle}>
              <div style={{ ...summaryCardStyle, background: "linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)" }}>
                <div style={summaryLabelStyle}>Steps goal</div>
                <div style={summaryValueStyle}>10,000</div>
                <div style={{ fontSize: "0.92rem", opacity: 0.85 }}>A daily activity target for the family.</div>
              </div>
              <div style={{ ...summaryCardStyle, background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)" }}>
                <div style={summaryLabelStyle}>Sleep target</div>
                <div style={summaryValueStyle}>8h</div>
                <div style={{ fontSize: "0.92rem", opacity: 0.85 }}>Standard healthy sleep goal per night.</div>
              </div>
              <div style={{ ...summaryCardStyle, background: "linear-gradient(135deg, #06b6d4 0%, #22d3ee 100%)" }}>
                <div style={summaryLabelStyle}>Water target</div>
                <div style={summaryValueStyle}>8+</div>
                <div style={{ fontSize: "0.92rem", opacity: 0.85 }}>Daily hydration goal in glasses.</div>
              </div>
            </div>
          </div>
        </div>

        <div style={formCardStyle}>
          <div style={{ marginBottom: "1.5rem" }}>
            <h2 style={{ margin: 0, fontSize: "1.45rem", fontWeight: 800, color: "#0f172a" }}>
              Add today's metrics
            </h2>
            <p style={{ marginTop: "0.5rem", color: "#475569", fontSize: "1rem", lineHeight: 1.7 }}>
              Choose a family member and enter their daily activity values. This form saves progress straight to the health metrics database.
            </p>
          </div>

          <div style={{ display: "grid", gap: "1rem" }}>
            <label style={labelStyle}>
              Membre
              <select value={selectedMemberId} onChange={(event) => setSelectedMemberId(event.target.value)} style={inputStyle}>
                {familyMembers.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>
            </label>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
              <label style={labelStyle}>
                Pas aujourd'hui
                <input
                  type="number"
                  min="0"
                  step="1"
                  placeholder="Ex: 8500"
                  value={steps}
                  onChange={(event) => setSteps(event.target.value)}
                  style={inputStyle}
                />
              </label>
              <label style={labelStyle}>
                Heures de sommeil
                <input
                  type="number"
                  min="0"
                  step="0.25"
                  placeholder="Ex: 7.5"
                  value={sleepHours}
                  onChange={(event) => setSleepHours(event.target.value)}
                  style={inputStyle}
                />
              </label>
            </div>

            <label style={labelStyle}>
              Verres d'eau
              <input
                type="number"
                min="0"
                step="1"
                placeholder="Ex: 8"
                value={waterGlasses}
                onChange={(event) => setWaterGlasses(event.target.value)}
                style={inputStyle}
              />
            </label>

            <button type="button" onClick={handleSave} disabled={saving} style={primaryButtonStyle}>
              {saving ? "Enregistrement..." : "Enregistrer les métriques"}
            </button>

            {message ? (
              <p style={{ color: message.includes("succès") ? "#047857" : "#b91c1c", fontWeight: 600, margin: 0 }}>
                {message}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
