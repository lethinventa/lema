import type { SignInCredentials, SignInResult } from '~/features/auth/types';
import type { Session, User } from '~/lib/supabase/client';
import { useSupabase } from '~/lib/supabase/client';

const currentUser = ref<User | null>(null);

// Memoized as a promise so route middleware can await the initial check
// instead of redirecting before it resolves.
let readyPromise: Promise<void> | null = null;

/**
 * Reactive current session (UC-AUTH-002), shared across the app.
 */
export function useAuthUser() {
  const ready = ensureInitialized();

  async function signIn(credentials: SignInCredentials): Promise<SignInResult> {
    const supabase = useSupabase();
    const { data, error } = await supabase.auth.signInWithPassword(credentials);

    if (error) {
      return { success: false, error: 'E-mail ou senha inválidos.' };
    }

    syncSession(data.session);
    return { success: true };
  }

  return {
    ready,
    user: computed(() => currentUser.value),
    isAuthenticated: computed(() => currentUser.value !== null),
    signIn,
  };
}

// Runs once for the whole app: hydrates the session persisted by
// supabase-js (localStorage) and keeps currentUser in sync afterwards.
function ensureInitialized(): Promise<void> {
  if (!readyPromise) {
    const supabase = useSupabase();
    readyPromise = supabase.auth.getSession().then(({ data }) => {
      syncSession(data.session);
    });
    supabase.auth.onAuthStateChange((_event, session) => syncSession(session));
  }
  return readyPromise;
}

function syncSession(session: Session | null) {
  currentUser.value = session?.user ?? null;
}
