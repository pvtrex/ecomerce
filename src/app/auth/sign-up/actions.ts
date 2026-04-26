
'use server';

import { auth } from '@/lib/auth/server';

export async function signUpWithEmail(
  _prevState: { error: string } | null,
  formData: FormData
) {
  const email = formData.get('email') as string;
  const name = formData.get('name') as string;
  const password = formData.get('password') as string;

  console.log('Attempting SignUp for:', email);

  const { error, data } = await auth.signUp.email({
    email,
    name,
    password,
  });

  console.log('Neon Auth SignUp Result:', { error, hasData: !!data });

  if (error) {
    return { error: error.message || 'Failed to create account' };
  }

  return { success: true };
}
