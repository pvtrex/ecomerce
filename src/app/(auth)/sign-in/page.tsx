"use client";

import AuthForm from "@/components/AuthForm";
import { signInWithEmail } from "@/app/auth/sign-in/actions";

export default function Page() {
  const handleSubmit = async (formData: FormData) => {
    const res = await signInWithEmail(null, formData);
    if (res?.error) {
      alert(res.error);
      return { ok: false };
    }
    return { ok: true };
  };

  return <AuthForm mode="sign-in" onSubmit={handleSubmit} />;
}
