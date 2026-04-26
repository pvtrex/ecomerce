
'use server';

import { auth } from '@/lib/auth/server';

export async function signInWithEmail(
  _prevState: { error: string } | null,
  formData: FormData
) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  console.log('Attempting SignIn for:', email);

  const { error, data } = await auth.signIn.email({
    email,
    password,
  });

  console.log('Neon Auth SignIn Result:', { error, hasData: !!data });

  if (error) {
    return { error: error.message || 'Failed to sign in. Try again' };
  }

  return { success: true };
}
