import { useRouter } from 'expo-router';
import { useState } from 'react';

import { AuthDoor, AuthMessage } from '@/components/auth/kit';
import { useAuth } from '@/lib/auth';

/**
 * 02 · Login — the app's front door, and the root of the auth stack.
 *
 * The laurel, "Welcome to VICI.", the two one-tap ways in and — under an
 * "or" — the email pill. The footer leads to `02B · Welcome Back`, which owns
 * the returning-user flow (address, password, code), so everything below is
 * the create path. The composition lives in `AuthDoor`: the two frames differ
 * in four strings and nothing else.
 */
export default function SignIn() {
  const router = useRouter();
  const { signInWithSSO } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function sso(strategy: 'oauth_apple' | 'oauth_google') {
    setLoading(true);
    setError(null);
    const res = await signInWithSSO(strategy);
    setLoading(false);
    if (res.ok) return router.replace('/');
    setError(res.error ?? 'Could not complete sign in.');
  }

  return (
    <AuthDoor
      variant="new"
      loading={loading}
      message={<AuthMessage error={error} notice={null} />}
      onApple={() => void sso('oauth_apple')}
      onGoogle={() => void sso('oauth_google')}
      // The subtitle frames this board as "Sign in **or create an account**"
      // and the footer sends people who already have one elsewhere, so the
      // email pill is the create path. It opens the sign-up *form* rather than
      // sign-up's gate, because the gate is the same Apple / Google / email
      // choice the man has just made. See DECISIONS.md D011.
      onEmail={() => router.push('/(auth)/sign-up?step=form')}
      onFooter={() => router.push('/(auth)/welcome-back')}
      // The canvas draws no back here — it composes this frame as the app's
      // first screen — but All and `03 · Name` also lead to it, and a pushed
      // screen with no way back strands you. Arriving from the splash is a
      // `replace`, so on the cold-start path there is nothing behind this and
      // the chevron would be a dead control.
      onBack={router.canGoBack() ? () => router.back() : undefined}
    />
  );
}
