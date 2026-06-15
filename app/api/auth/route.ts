import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createHash } from "crypto";
import { cookies } from "next/headers";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

function hashPassword(password: string): string {
  return createHash("sha256").update(password + "familyvital_salt").digest("hex");
}

export async function POST(req: Request) {
  const body = await req.json();
  const { action, email, password, familyName, member, memberId } = body;

  if (action === "logout") {
    const res = NextResponse.json({ ok: true });
    res.cookies.delete("fv_session");
    return res;
  }

  if (action === "signup") {
    if (!email || !password || !familyName) {
      return NextResponse.json({ error: "Champs manquants." }, { status: 400 });
    }
    const { data: existing } = await supabase.from("users").select("id").eq("email", email).single();
    if (existing) return NextResponse.json({ error: "Un compte existe déjà avec cet email." }, { status: 400 });
    if (password.length < 6) return NextResponse.json({ error: "Mot de passe trop court." }, { status: 400 });
    const { error } = await supabase.from("users").insert({ email, password_hash: hashPassword(password), family_name: familyName });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    const res = NextResponse.json({ ok: true, familyName });
    res.cookies.set("fv_session", email, { httpOnly: true, path: "/", maxAge: 60 * 60 * 24 * 30 });
    return res;
  }

  if (action === "login") {
    const { data: user } = await supabase.from("users").select("*").eq("email", email).single();
    if (!user || user.password_hash !== hashPassword(password)) {
      return NextResponse.json({ error: "Email ou mot de passe incorrect." }, { status: 401 });
    }
    const res = NextResponse.json({ ok: true, familyName: user.family_name });
    res.cookies.set("fv_session", email, { httpOnly: true, path: "/", maxAge: 60 * 60 * 24 * 30 });
    return res;
  }

  if (action === "addMember") {
    const { data: user } = await supabase.from("users").select("id").eq("email", email).single();
    if (!user) return NextResponse.json({ error: "Non connecté." }, { status: 401 });
    const { error: insertError } = await supabase.from("family_members").insert({ ...member, user_id: user.id });
    if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });
    const { data: members } = await supabase.from("family_members").select("*").eq("user_id", user.id);
    return NextResponse.json({ ok: true, members });
  }

  if (action === "removeMember") {
    const { data: user } = await supabase.from("users").select("id").eq("email", email).single();
    if (!user) return NextResponse.json({ error: "Non connecté." }, { status: 401 });
    await supabase.from("family_members").delete().eq("id", memberId);
    const { data: members } = await supabase.from("family_members").select("*").eq("user_id", user.id);
    return NextResponse.json({ ok: true, members });
  }

  return NextResponse.json({ error: "Action inconnue." }, { status: 400 });
}
