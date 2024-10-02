import GitHub from "@auth/core/providers/github";
import Resend from "@auth/core/providers/resend";
import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [GitHub, Resend, Password],
  jwt: {
    durationMs: 1000 * 60 * 10, // 10 minutes
  },
});
