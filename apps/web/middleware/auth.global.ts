import { useAuthStore } from '~/features/auth';

// UC-AUTH-002: everything except /login requires an authenticated session.
export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuthStore();
  await auth.ready;

  if (!auth.isAuthenticated && to.path !== '/login') {
    return navigateTo('/login');
  }

  if (auth.isAuthenticated && to.path === '/login') {
    return navigateTo('/');
  }
});
