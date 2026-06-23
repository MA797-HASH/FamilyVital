import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function GET() {
  const cookieStore = await cookies();
  const email = cookieStore.get("fv_session")?.value ?? null;
  if (!email) {
    return NextResponse.json({ error: "Non connecté." }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("users")
    .select("id,email,family_name, family_members(*)")
    .eq("email", email)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? "Utilisateur introuvable." }, { status: 404 });
  }

  const members = (data.family_members || []).map((member: any) => ({
    id: String(member.id),
    name: member.name,
    role: member.role,
    age: member.age,
    initials: member.initials,
    avatar_color: member.avatar_color,
    focus: member.focus,
    resting_hr: member.resting_hr,
  }));

  return NextResponse.json({
    familyName: data.family_name,
    members,
  });
}
