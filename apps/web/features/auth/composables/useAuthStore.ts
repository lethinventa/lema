import { defineStore } from 'pinia';
import type { Session, User } from '~/lib/supabase/client';
import { useSupabase } from '~/lib/supabase/client';

/**
 * Reactive current session (UC-AUTH-002), shared across the app.
 */
export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const isAuthenticated = computed(() => user.value !== null);

  // Hydrates the session persisted by supabase-js (localStorage) and keeps
  // `user` in sync afterwards. Runs once for the whole app — Pinia only
  // calls this setup function the first time useAuthStore() is invoked.
  const supabase = useSupabase();
  const ready = supabase.auth
    .getSession()
    .then(({ data }) => syncSession(data.session));
  supabase.auth.onAuthStateChange((_event, session) => syncSession(session));

  async function signIn(credentials: {
    email: string;
    password: string;
  }): Promise<{ success: boolean; error?: string }> {
    const { data, error } = await supabase.auth.signInWithPassword(credentials);

    if (error) {
      // UC-AUTH-002: generic on purpose — never reveals whether the email
      // or the password was wrong.
      return { success: false, error: 'E-mail ou senha inválidos.' };
    }

    syncSession(data.session);
    return { success: true };
  }

  function syncSession(session: Session | null) {
    user.value = session?.user ?? null;
  }

  return { ready, user, isAuthenticated, signIn };
});
