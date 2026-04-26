"use client";

import AuthForm from "@/components/AuthForm";
import { useRouter } from "next/navigation";
import { signUpWithEmail } from "@/app/auth/sign-up/actions";

export default function Page() {
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    const res = await signUpWithEmail(null, formData);
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

  return <AuthForm mode="sign-up" onSubmit={handleSubmit} />;
}
