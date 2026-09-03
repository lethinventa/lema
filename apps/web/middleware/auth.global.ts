import { useAuthUser } from '~/features/auth';

// UC-AUTH-002: everything except /login requires an authenticated session.
export default defineNuxtRouteMiddleware(async (to) => {
  const { ready, isAuthenticated } = useAuthUser();
  await ready;

  if (!isAuthenticated.value && to.path !== '/login') {
    return navigateTo('/login');
  }

  if (isAuthenticated.value && to.path === '/login') {
    return navigateTo('/');
  }
});
