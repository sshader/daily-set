import GitHub from "@auth/core/providers/github";
import Resend from "@auth/core/providers/resend";
import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [GitHub, Resend, Password],
  jwt: {
    durationMs: 1000 * 60 * 10, // 10 minutes
  },
  callbacks: {
    async redirect({ redirectTo }) {
      if (redirectTo.startsWith("/")) {
        return `${process.env.SITE_URL!}${redirectTo}`;
      }
      const url = new URL(redirectTo);
      if (url.origin === process.env.SITE_URL) {
        return redirectTo;
      }

      if (url.hostname === "localhost") {
        return redirectTo;
      }
      throw new Error(`Invalid redirect URL: ${redirectTo}`);
    },
  },
});
