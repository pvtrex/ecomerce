"use client";

import AuthForm from "@/components/AuthForm";
import { signUpWithEmail } from "@/app/auth/sign-up/actions";

export default function Page() {
  const handleSubmit = async (formData: FormData) => {
    const res = await signUpWithEmail(null, formData);
    if (res?.error) {
      alert(res.error);
      return { ok: false };
    }
    return { ok: true };
  };

  return <AuthForm mode="sign-up" onSubmit={handleSubmit} />;
}
