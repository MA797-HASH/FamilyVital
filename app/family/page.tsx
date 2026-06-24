import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import FamilyClient from "./family-client";

export default async function FamilyPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        padding: "2rem 1rem",
      }}
    >
      <div
        style={{
          maxWidth: "980px",
          margin: "0 auto",
          padding: "0 0.75rem",
        }}
      >
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "28px",
            border: "1px solid rgba(148, 163, 184, 0.16)",
            boxShadow: "0 24px 64px rgba(15, 23, 42, 0.08)",
            padding: "2rem",
            marginBottom: "1.5rem",
          }}
        >
          <p
            style={{
              margin: 0,
              color: "#2563eb",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              fontSize: "0.85rem",
              fontWeight: 700,
            }}
          >
            Family hub
          </p>
          <h1
            style={{
              margin: "0.75rem 0 0",
              fontSize: "2.7rem",
              lineHeight: 1.05,
              fontWeight: 800,
              color: "#0f172a",
            }}
          >
            {user.familyName}
          </h1>
          <p
            style={{
              marginTop: "0.9rem",
              color: "#475569",
              fontSize: "1rem",
              lineHeight: 1.75,
              maxWidth: "760px",
            }}
          >
            Gérez les profils de votre famille avec un design moderne, des cartes visuelles et des interactions claires.
          </p>
        </div>

        <FamilyClient user={JSON.parse(JSON.stringify(user))} />
      </div>
    </div>
  );
}
