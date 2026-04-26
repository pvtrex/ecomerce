"use client";

import AuthForm from "@/components/AuthForm";
import { useRouter } from "next/navigation";
import { signInWithEmail } from "@/app/auth/sign-in/actions";

export default function Page() {
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    const res = await signInWithEmail(null, formData);
    if (res?.error) {
      alert(res.error);
      return { ok: false };
    }
    if (res?.success) {
      router.push("/");
      return { ok: true };
    }
    return { ok: false };
  };

  return <AuthForm mode="sign-in" onSubmit={handleSubmit} />;
}
