export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useCookie(REFRESH_TOKEN_KEY);

  if (to.path != "/" && to.path != "/login" && auth.value == undefined) {
    return navigateTo(pageRoutes.login);
  }
});
