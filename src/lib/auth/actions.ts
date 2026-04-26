"use server";

import {cookies, headers} from "next/headers";
import { z } from "zod";
import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { guests } from "@/lib/db/schema/index";
import { and, eq, lt } from "drizzle-orm";
import { randomUUID } from "crypto";

const COOKIE_OPTIONS = {
  httpOnly: true as const,
  secure: true as const,
  sameSite: "strict" as const,
  path: "/" as const,
  maxAge: 60 * 60 * 24 * 7, // 7 days
};

export async function createGuestSession() {
  const cookieStore = await cookies();
  const existing = (await cookieStore).get("guest_session");
  if (existing?.value) {
    return { ok: true, sessionToken: existing.value };
  }

  const sessionToken = randomUUID();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + COOKIE_OPTIONS.maxAge * 1000);

  await db.insert(guests).values({
    sessionToken,
    expiresAt,
  });

  (await cookieStore).set("guest_session", sessionToken, COOKIE_OPTIONS);
  return { ok: true, sessionToken };
}

export async function guestSession() {
  const cookieStore = await cookies();
  const token = (await cookieStore).get("guest_session")?.value;
  if (!token) {
    return { sessionToken: null };
  }
  const now = new Date();
  await db
    .delete(guests)
    .where(and(eq(guests.sessionToken, token), lt(guests.expiresAt, now)));

  return { sessionToken: token };
}

export async function signUp(formData: FormData) {
  const email = formData.get('email') as string;
  const name = formData.get('name') as string;
  const password = formData.get('password') as string;

  const { error, data } = await auth.signUp.email({
    email,
    password,
    name,
  });

  if (error) {
    throw new Error(error.message);
  }

  await migrateGuestToUser();
  return { ok: true, userId: data?.user?.id };
}

export async function signIn(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const { error, data } = await auth.signIn.email({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  await migrateGuestToUser();
  return { ok: true, userId: data?.user?.id };
}

export async function getCurrentUser() {
  try {
    const { data: session } = await auth.getSession();
    return session?.user ?? null;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function signOut() {
  // Neon Auth might have a different signOut method or we just clear cookies
  // According to Better Auth (which Neon Auth uses under the hood), it's auth.signOut()
  await auth.signOut();
  return { ok: true };
}

export async function mergeGuestCartWithUserCart() {
  await migrateGuestToUser();
  return { ok: true };
}

async function migrateGuestToUser() {
  const cookieStore = await cookies();
  const token = (await cookieStore).get("guest_session")?.value;
  if (!token) return;

  await db.delete(guests).where(eq(guests.sessionToken, token));
  (await cookieStore).delete("guest_session");
}
