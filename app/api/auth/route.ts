import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUsers, saveUsers, hashPassword, User } from "@/lib/auth";

export async function POST(req: Request) {
  const { action, email, password, familyName } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Email et mot de passe requis." }, { status: 400 });
  }

  const users = getUsers();

  if (action === "signup") {
    if (users[email]) {
      return NextResponse.json({ error: "Un compte existe déjà avec cet email." }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "Mot de passe trop court (min. 6 caractères)." }, { status: 400 });
    }
    const newUser: User = {
      email,
      passwordHash: hashPassword(password),
      familyName: familyName || "Ma Famille",
      members: [],
      createdAt: new Date().toISOString(),
    };
    users[email] = newUser;
    saveUsers(users);
    const res = NextResponse.json({ ok: true, familyName: newUser.familyName });
    res.cookies.set("fv_session", email, { httpOnly: true, path: "/", maxAge: 60 * 60 * 24 * 30 });
    return res;
  }

  if (action === "login") {
    const user = users[email];
    if (!user || user.passwordHash !== hashPassword(password)) {
      return NextResponse.json({ error: "Email ou mot de passe incorrect." }, { status: 401 });
    }
    const res = NextResponse.json({ ok: true, familyName: user.familyName });
    res.cookies.set("fv_session", email, { httpOnly: true, path: "/", maxAge: 60 * 60 * 24 * 30 });
    return res;
  }

  if (action === "logout") {
    const res = NextResponse.json({ ok: true });
    res.cookies.delete("fv_session");
    return res;
  }

  if (action === "addMember") {
    const email2 = req.headers.get("x-user-email") || "";
    const user = users[email2];
    if (!user) return NextResponse.json({ error: "Non connecté." }, { status: 401 });
    const { member } = await req.json().catch(() => ({ member: null }));
    // handled below
  }

  return NextResponse.json({ error: "Action inconnue." }, { status: 400 });
}
