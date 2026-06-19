import { cookies } from "next/headers";

export interface FamilyMember {
  id?: string;
  name: string;
  age: number;
  role: string;
  initials: string;
  avatar_color: string;
  focus: string;
  resting_hr: number;
}

export interface User {
  email: string;
  passwordHash: string;
  familyName: string;
  members: FamilyMember[];
  createdAt: string;
}

import { createHash } from "crypto";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function getUsers(): Promise<Record<string, User>> {
  const { data, error } = await supabase
    .from("users")
    .select("id,email,password_hash,family_name,created_at, family_members(*)");
  if (error || !data) return {};
  const out: Record<string, User> = {};
  for (const u of data as any[]) {
    const members = (u.family_members || []).map((m: any) => ({
      id: String(m.id),
      name: m.name,
      age: m.age,
      role: m.role,
      initials: m.initials,
      avatar_color: m.avatar_color ?? m.avatarColor,
      focus: m.focus,
      resting_hr: m.resting_hr ?? m.restingHr,
    }));
    out[u.email] = {
      email: u.email,
      passwordHash: u.password_hash,
      familyName: u.family_name,
      members,
      createdAt: u.created_at,
    };
  }
  return out;
}

export async function saveUsers(users: Record<string, User>) {
  for (const email of Object.keys(users)) {
    const u = users[email];
    // upsert user
    const { error: upsertErr } = await supabase.from("users").upsert({
      email: u.email,
      password_hash: u.passwordHash,
      family_name: u.familyName,
      created_at: u.createdAt,
    });
    if (upsertErr) continue;
    // fetch id
    const { data: userRow } = await supabase.from("users").select("id").eq("email", u.email).single();
    if (!userRow) continue;
    const userId = userRow.id;
    // delete existing members and re-insert
    await supabase.from("family_members").delete().eq("user_id", userId);
    if (u.members && u.members.length > 0) {
      const toInsert = u.members.map((m) => ({
        id: m.id,
        name: m.name,
        age: m.age,
        role: m.role,
        initials: m.initials,
        avatar_color: m.avatar_color,
        focus: m.focus,
        resting_hr: m.resting_hr,
        user_id: userId,
      }));
      await supabase.from("family_members").insert(toInsert);
    }
  }
}

export function hashPassword(password: string): string {
  return createHash("sha256").update(password + "familyvital_salt").digest("hex");
}

export async function getSession(): Promise<string | null> {
  const cookieStore = await cookies();
  const email = cookieStore.get("fv_session")?.value ?? null;
  if (!email) return null;

  const { data } = await supabase.from("users").select("email").eq("email", email).single();
  return data?.email ?? null;
}

export async function getCurrentUser(): Promise<User | null> {
  const email = await getSession();
  if (!email) return null;

  const { data, error } = await supabase
    .from("users")
    .select("id,email,password_hash,family_name,created_at, family_members(*)")
    .eq("email", email)
    .single();

  if (error || !data) return null;

  const members = (data.family_members || []).map((m: any) => ({
    id: String(m.id),
    name: m.name,
    age: m.age,
    role: m.role,
    initials: m.initials,
    avatar_color: m.avatar_color ?? m.avatarColor,
    focus: m.focus,
    resting_hr: m.resting_hr ?? m.restingHr,
  }));

  return {
    email: data.email,
    passwordHash: data.password_hash,
    familyName: data.family_name,
    members,
    createdAt: data.created_at,
  };
}
