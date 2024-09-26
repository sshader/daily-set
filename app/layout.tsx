import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";
import "./globals.css";
import {
  ConvexAuthNextjsServerProvider,
  convexAuthNextjsToken,
} from "@convex-dev/auth/nextjs/server";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import { Toaster } from "@/components/ui/toaster";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/UserMenu";
import { HomeIcon } from "@radix-ui/react-icons";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Daily Set",
  description: "Play the daily Set puzzle with your friends",
  icons: {
    icon: "/convex.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexAuthNextjsServerProvider>
      {/* `suppressHydrationWarning` only affects the html tag,
      and is needed by `ThemeProvider` which sets the theme
      class attribute on it */}
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <ConvexClientProvider>
            <Toaster />
            <ThemeProvider attribute="class">
              <Inner>{children}</Inner>
            </ThemeProvider>
          </ConvexClientProvider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}

async function Inner({ children }: { children: React.ReactNode }) {
  const viewer = await fetchQuery(
    api.users.viewer,
    {},
    {
      token: convexAuthNextjsToken(),
    },
  );

  return (
    <div className="w-screen h-screen flex flex-col gap-10">
      <div className="flex flex-row justify-between pt-4">
        <Link href="/">
          <Button variant="secondary" size="icon" className="rounded-full">
            <HomeIcon className="h-4 w-4" />
          </Button>
        </Link>
        {viewer === null ? (
          <Link href="/signin">
            <Button>Sign in</Button>
          </Link>
        ) : (
          <UserMenu>{viewer.name ?? viewer.email}</UserMenu>
        )}
      </div>
      <div className="flex w-screen  h-[calc(100vh-36px)]">{children}</div>
    </div>
  );
}
