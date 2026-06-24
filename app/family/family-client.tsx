"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";
import type { User, FamilyMember } from "@/lib/auth";

const COLORS = ["#1E5C3A", "#2E7D52", "#D4872B", "#6B4C9A", "#2C7BB6", "#C0392B"];
const ROLES = ["Parent", "Enfant", "Grand-parent", "Autre"];

const pageStyle = {
  width: "100%",
  maxWidth: "980px",
  margin: "0 auto",
};

const headerStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  marginBottom: "1.75rem",
};

const headerTitleStyle = {
  margin: 0,
  fontSize: "2.4rem",
  fontWeight: 800,
  color: "#0f172a",
  lineHeight: 1.05,
};

const headerTextStyle = {
  margin: 0,
  color: "#475569",
  fontSize: "1rem",
  lineHeight: 1.75,
  maxWidth: "760px",
};

const actionButtonStyle = {
  backgroundColor: "#2563eb",
  color: "#ffffff",
  border: "none",
  borderRadius: "1rem",
  padding: "0.95rem 1rem",
  fontSize: "1rem",
  fontWeight: 700,
  cursor: "pointer",
  boxShadow: "0 16px 32px rgba(37, 99, 235, 0.18)",
};

const memberGridStyle = {
  display: "grid",
  gap: "1rem",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
};

const memberCardStyle = {
  backgroundColor: "#ffffff",
  borderRadius: "24px",
  border: "1px solid rgba(148, 163, 184, 0.16)",
  boxShadow: "0 24px 64px rgba(15, 23, 42, 0.08)",
  padding: "1.5rem",
  display: "flex",
  flexDirection: "column",
  gap: "1.25rem",
  textDecoration: "none",
  color: "inherit",
};

const cardHeaderStyle = {
  display: "flex",
  alignItems: "center",
  gap: "1rem",
};

const avatarStyle = {
  width: "56px",
  height: "56px",
  borderRadius: "999px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "1.25rem",
  fontWeight: 800,
  color: "#ffffff",
};

const memberNameStyle = {
  margin: 0,
  fontSize: "1.1rem",
  fontWeight: 800,
  color: "#0f172a",
};

const memberMetaStyle = {
  margin: "0.35rem 0 0",
  color: "#64748b",
  fontSize: "0.95rem",
  lineHeight: 1.5,
};

const badgeBaseStyle = {
  borderRadius: "999px",
  padding: "0.5rem 0.85rem",
  fontSize: "0.85rem",
  fontWeight: 700,
};

const roleBadgeStyles = {
  Parent: { backgroundColor: "#eff6ff", color: "#2563eb" },
  Enfant: { backgroundColor: "#e0f2fe", color: "#0369a1" },
  "Grand-parent": { backgroundColor: "#fef3c7", color: "#b45309" },
  Autre: { backgroundColor: "#ede9fe", color: "#7c3aed" },
};

const formCardStyle = {
  backgroundColor: "#ffffff",
  borderRadius: "28px",
  border: "1px solid rgba(148, 163, 184, 0.16)",
  boxShadow: "0 24px 64px rgba(15, 23, 42, 0.08)",
  padding: "2rem",
  marginTop: "1.5rem",
};

const formRowStyle = {
  display: "grid",
  gap: "1rem",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
};

const labelStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
  fontWeight: 700,
  color: "#334155",
  fontSize: "0.95rem",
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

const smallInputStyle = {
  ...inputStyle,
  width: "100%",
};

const errorTextStyle = {
  margin: 0,
  color: "#ef4444",
  fontSize: "0.95rem",
  fontWeight: 600,
};

const addButtonStyle = {
  ...actionButtonStyle,
  width: "auto",
  alignSelf: "center",
  padding: "0.95rem 1.15rem",
};

export default function FamilyClient({ user }: { user: User }) {
  const router = useRouter();
  const [members, setMembers] = useState<FamilyMember[]>(user.members);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [role, setRole] = useState("Enfant");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const addMember = async () => {
    setError("");
    if (!name.trim()) return setError("Entrez un prénom.");
    const ageNum = parseInt(age, 10);
    if (!age || isNaN(ageNum) || ageNum < 0 || ageNum > 120) return setError("Âge invalide.");
    setLoading(true);
    const newMember: FamilyMember = {
      name: name.trim(),
      age: ageNum,
      role,
      initials: name.trim().charAt(0).toUpperCase(),
      avatar_color: COLORS[members.length % COLORS.length],
      focus: "Général",
      resting_hr: 70,
    };

    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "addMember", email: user.email, password: "_session_", member: newMember }),
    });

    const data = await res.json();
    if (data.ok) {
      setMembers(data.members);
      setName("");
      setAge("");
    } else {
      setError(data.error);
    }
    setLoading(false);
  };

  const removeMember = async (id: string) => {
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "removeMember", email: user.email, password: "_session_", memberId: id }),
    });
    const data = await res.json();
    if (data.ok) setMembers(data.members);
  };

  const logout = async () => {
    await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout", email: "", password: "" }),
    });
    router.push("/login");
  };

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <div>
          <p style={{ margin: 0, color: "#2563eb", letterSpacing: "0.08em", textTransform: "uppercase", fontSize: "0.85rem", fontWeight: 700 }}>
            Family profiles
          </p>
          <h2 style={headerTitleStyle}>{user.familyName}</h2>
          <p style={headerTextStyle}>Gérez les membres de votre famille avec une page claire, accueillante et facile à utiliser.</p>
        </div>
        <button style={actionButtonStyle} onClick={logout}>Déconnexion</button>
      </div>

      <div style={memberGridStyle}>
        {members.map((m) => (
          <Link
            key={m.id || ""}
            href={`/family/${m.id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div style={memberCardStyle}>
              <div style={cardHeaderStyle}>
                <div style={{ ...avatarStyle, backgroundColor: m.avatar_color ?? "#2563eb" }}>
                  {m.initials || m.name.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={memberNameStyle}>{m.name}</p>
                  <p style={memberMetaStyle}>{m.role} · {m.age} ans</p>
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    removeMember(m.id!);
                  }}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#ef4444",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "0.75rem", alignItems: "center" }}>
                <span style={{ ...badgeBaseStyle, ...(roleBadgeStyles[m.role] ?? roleBadgeStyles.Autre) }}>
                  {m.role}
                </span>
                <span style={{ color: "#64748b", fontSize: "0.95rem", fontWeight: 700 }}>{m.resting_hr} bpm</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div style={formCardStyle}>
        <div style={{ marginBottom: "1.5rem" }}>
          <p style={{ margin: 0, color: "#2563eb", letterSpacing: "0.08em", textTransform: "uppercase", fontSize: "0.85rem", fontWeight: 700 }}>
            Add member
          </p>
          <h3 style={{ margin: "0.75rem 0 0", fontSize: "1.6rem", fontWeight: 800, color: "#0f172a" }}>
            Ajouter un nouveau profil
          </h3>
          <p style={sectionTextStyle}>Entrez le prénom, l'âge et le rôle pour ajouter un membre à votre famille.</p>
        </div>

        {error ? <p style={errorTextStyle}>⚠ {error}</p> : null}

        <div style={formRowStyle}>
          <label style={labelStyle}>
            Prénom
            <input
              style={inputStyle}
              placeholder="ex: Marie"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>

          <label style={labelStyle}>
            Âge
            <input
              style={inputStyle}
              type="number"
              placeholder="ex: 34"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </label>

          <label style={labelStyle}>
            Rôle
            <select style={inputStyle} value={role} onChange={(e) => setRole(e.target.value)}>
              {ROLES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </label>

          <button style={addButtonStyle} onClick={addMember} disabled={loading}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
              <Plus size={16} /> Ajouter
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
