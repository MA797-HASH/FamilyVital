import { cookies } from "next/headers";

export interface FamilyMember {
  id: string;
  name: string;
  age: number;
  role: string;
  initials: string;
  avatarColor: string;
  focus: string;
  restingHr: number;
}

export interface User {
  email: string;
  passwordHash: string;
  familyName: string;
  members: FamilyMember[];
  createdAt: string;
}

import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import { createHash } from "crypto";

const DB_PATH = join(process.cwd(), "data", "users.json");

function ensureDB() {
  const dir = join(process.cwd(), "data");
  if (!existsSync(dir)) {
    const { mkdirSync } = require("fs");
    mkdirSync(dir, { recursive: true });
  }
  if (!existsSync(DB_PATH)) {
    writeFileSync(DB_PATH, JSON.stringify({}));
  }
}

export function getUsers(): Record<string, User> {
  ensureDB();
  return JSON.parse(readFileSync(DB_PATH, "utf-8"));
}

export function saveUsers(users: Record<string, User>) {
  ensureDB();
  writeFileSync(DB_PATH, JSON.stringify(users, null, 2));
}

export function hashPassword(password: string): string {
  return createHash("sha256").update(password + "familyvital_salt").digest("hex");
}

export function getSession(): string | null {
  const cookieStore = cookies();
  return cookieStore.get("fv_session")?.value ?? null;
}

export function getCurrentUser(): User | null {
  const email = getSession();
  if (!email) return null;
  const users = getUsers();
  return users[email] ?? null;
}
