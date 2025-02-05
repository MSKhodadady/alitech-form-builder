export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useCookie(REFRESH_TOKEN_KEY);

  if (to.meta.requiredAuth && auth.value == undefined) {
    return navigateTo(pageRoutes.login);
  }

  if (to.meta.isLogin && auth.value != undefined) {
    return navigateTo(pageRoutes.dashboard);
  }
});
