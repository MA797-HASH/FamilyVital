import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { AppShell } from "@/components/app-shell";
import FamilyClient from "./family-client";

export default async function FamilyPage() {
  const user = getCurrentUser();
  if (!user) redirect("/login");

  return (
    <AppShell>
      <FamilyClient user={JSON.parse(JSON.stringify(user))} />
    </AppShell>
  );
}
