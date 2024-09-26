"use client";

import { SignInMethodDivider } from "@/components/SignInMethodDivider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { useAuthActions } from "@convex-dev/auth/react";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { useState } from "react";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen w-full container my-auto mx-auto">
      <div className="max-w-[384px] mx-auto flex flex-col my-auto gap-4 pb-8">
        <>
          <h2 className="font-semibold text-2xl tracking-tight">
            Sign in or create an account
          </h2>
          <SignInWithGitHub />
          <SignInMethodDivider />
          <SignInWithPassword />
        </>
      </div>
    </div>
  );
}

function SignInWithGitHub() {
  const { signIn } = useAuthActions();
  return (
    <Button
      className="flex-1"
      variant="outline"
      type="button"
      onClick={() => void signIn("github", { redirectTo: "/" })}
    >
      <GitHubLogoIcon className="mr-2 h-4 w-4" /> GitHub
    </Button>
  );
}

function SignInWithPassword({}: {}) {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  return (
    <form
      className="flex flex-col"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitting(true);
        const formData = new FormData(event.currentTarget);
        signIn("password", formData).catch((error) => {
          console.error(error);
          const title =
            flow === "signIn"
              ? "Could not sign in, did you mean to sign up?"
              : "Could not sign up, did you mean to sign in?";
          toast({ title, variant: "destructive" });
          setSubmitting(false);
        });
      }}
    >
      <label htmlFor="email">Email</label>
      <Input name="email" id="email" className="mb-4" autoComplete="email" />
      <div className="flex items-center justify-between">
        <label htmlFor="password">Password</label>
      </div>
      <Input
        type="password"
        name="password"
        id="password"
        className="mb-4 "
        autoComplete={flow === "signIn" ? "current-password" : "new-password"}
      />
      <input name="flow" value={flow} type="hidden" />
      <Button type="submit" disabled={submitting}>
        {flow === "signIn" ? "Sign in" : "Sign up"}
      </Button>
      <Button
        variant="link"
        type="button"
        onClick={() => {
          setFlow(flow === "signIn" ? "signUp" : "signIn");
        }}
      >
        {flow === "signIn"
          ? "Don't have an account? Sign up"
          : "Already have an account? Sign in"}
      </Button>
    </form>
  );
}
