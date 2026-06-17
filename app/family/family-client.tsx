"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import type { User, FamilyMember } from "@/lib/auth";

const COLORS = ["#1E5C3A","#2E7D52","#D4872B","#6B4C9A","#2C7BB6","#C0392B"];
const ROLES = ["Parent","Enfant","Grand-parent","Autre"];

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
    const ageNum = parseInt(age);
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
    if (data.ok) { setMembers(data.members); setName(""); setAge(""); }
    else setError(data.error);
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
    await fetch("/api/auth", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "logout", email: "", password: "" }) });
    router.push("/login");
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-8 md:py-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground">{user.familyName}</h1>
          <p className="mt-1 text-muted-foreground">Gérez les profils de votre famille.</p>
        </div>
        <Button size="lg" variant="secondary" onClick={logout}>Déconnexion</Button>
      </header>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {members.map((m) => (
          <Card key={m.id} className="flex flex-col gap-4 p-6 transition-shadow hover:shadow-md">
            <div className="flex items-center gap-4">
              <Avatar className="size-14">
                <AvatarFallback style={{ backgroundColor: m.avatarColor }} className="text-lg font-bold text-white">
                  {m.initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-heading text-lg font-bold text-foreground">{m.name}</p>
                <p className="text-sm text-muted-foreground">{m.role} · {m.age} ans</p>
              </div>
              <button onClick={() => removeMember(m.id)} className="text-red-400 hover:text-red-600 transition-colors">
                <Trash2 className="size-4" />
              </button>
            </div>
            <Badge variant="secondary" className="w-fit">{m.focus}</Badge>
          </Card>
        ))}
      </div>

      <Card className="mt-8 p-6">
        <h2 className="font-heading text-lg font-bold mb-4">Ajouter un membre</h2>
        {error && <p className="text-red-500 text-sm mb-3">⚠ {error}</p>}
        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">Prénom</label>
            <input className="border rounded-lg px-3 py-2 text-sm w-36 focus:outline-none focus:ring-2 focus:ring-green-500" value={name} onChange={e => setName(e.target.value)} placeholder="ex: Marie" />
          </div>
          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">Âge</label>
            <input className="border rounded-lg px-3 py-2 text-sm w-20 focus:outline-none focus:ring-2 focus:ring-green-500" type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="ex: 34" />
          </div>
          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">Rôle</label>
            <select className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" value={role} onChange={e => setRole(e.target.value)}>
              {ROLES.map(r => <option key={r}>{r}</option>)}
            </select>
          </div>
          <Button onClick={addMember} disabled={loading} className="flex items-center gap-2">
            <Plus className="size-4" /> Ajouter
          </Button>
        </div>
      </Card>
    </div>
  );
}
