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
      recorded_at: new Date().toISOString(),
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

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "2rem",
          backgroundColor: "#f3f4f6",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "560px",
            backgroundColor: "#ffffff",
            borderRadius: "1rem",
            padding: "2rem",
            boxShadow: "0 10px 24px rgba(0, 0, 0, 0.08)",
          }}
        >
          Chargement des membres de la famille...
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f3f4f6",
        padding: "2rem",
      }}
    >
      <div
        style={{
          maxWidth: "680px",
          margin: "0 auto",
          backgroundColor: "#ffffff",
          borderRadius: "1.25rem",
          boxShadow: "0 16px 40px rgba(15, 23, 42, 0.08)",
          padding: "2rem",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "2rem", fontWeight: 700, color: "#111827" }}>
          Enregistrer les métriques du jour
        </h1>
        <p style={{ marginTop: "0.75rem", color: "#4b5563", lineHeight: 1.7 }}>
          Sélectionnez un membre de la famille, indiquez le nombre de pas, les heures de sommeil et le nombre de verres d'eau pour aujourd'hui.
        </p>

        <div
          style={{
            marginTop: "1.75rem",
            display: "grid",
            gap: "1rem",
          }}
        >
          <label style={{ display: "flex", flexDirection: "column", gap: "0.5rem", color: "#374151", fontWeight: 600 }}>
            Membre
            <select
              value={selectedMemberId}
              onChange={(event) => setSelectedMemberId(event.target.value)}
              style={{
                width: "100%",
                minHeight: "3rem",
                borderRadius: "0.75rem",
                border: "1px solid #d1d5db",
                padding: "0.75rem 0.9rem",
                fontSize: "1rem",
                backgroundColor: "#ffffff",
              }}
            >
              {familyMembers.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: "0.5rem", color: "#374151", fontWeight: 600 }}>
            Pas aujourd'hui
            <input
              type="number"
              min="0"
              step="1"
              placeholder="Ex: 8500"
              value={steps}
              onChange={(event) => setSteps(event.target.value)}
              style={{
                width: "100%",
                borderRadius: "0.75rem",
                border: "1px solid #d1d5db",
                padding: "0.75rem 0.9rem",
                fontSize: "1rem",
              }}
            />
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: "0.5rem", color: "#374151", fontWeight: 600 }}>
            Heures de sommeil
            <input
              type="number"
              min="0"
              step="0.25"
              placeholder="Ex: 7.5"
              value={sleepHours}
              onChange={(event) => setSleepHours(event.target.value)}
              style={{
                width: "100%",
                borderRadius: "0.75rem",
                border: "1px solid #d1d5db",
                padding: "0.75rem 0.9rem",
                fontSize: "1rem",
              }}
            />
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: "0.5rem", color: "#374151", fontWeight: 600 }}>
            Verres d'eau
            <input
              type="number"
              min="0"
              step="1"
              placeholder="Ex: 8"
              value={waterGlasses}
              onChange={(event) => setWaterGlasses(event.target.value)}
              style={{
                width: "100%",
                borderRadius: "0.75rem",
                border: "1px solid #d1d5db",
                padding: "0.75rem 0.9rem",
                fontSize: "1rem",
              }}
            />
          </label>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            style={{
              width: "100%",
              backgroundColor: "#2563eb",
              color: "#ffffff",
              border: "none",
              borderRadius: "0.9rem",
              padding: "0.95rem 1rem",
              fontSize: "1rem",
              fontWeight: 700,
              cursor: saving ? "not-allowed" : "pointer",
              opacity: saving ? 0.75 : 1,
              marginTop: "0.5rem",
            }}
          >
            {saving ? "Enregistrement..." : "Enregistrer les métriques"}
          </button>

          {message ? (
            <p style={{ color: message.includes("succès") ? "#047857" : "#b91c1c", fontWeight: 600 }}>
              {message}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
