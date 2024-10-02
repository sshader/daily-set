import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

const isSignInPage = createRouteMatcher(["/signin"]);
const isProtectedRoute = createRouteMatcher(["/leaderboard(.*)", "/"]);

export default convexAuthNextjsMiddleware(
  (request, { convexAuth }) => {
    if (isSignInPage(request) && convexAuth.isAuthenticated()) {
      return nextjsMiddlewareRedirect(request, "/");
    }
    if (isProtectedRoute(request) && !convexAuth.isAuthenticated()) {
      return nextjsMiddlewareRedirect(request, "/signin");
    }
  },
  { verbose: true },
);

export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
