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
import { HomeIcon, ListBulletIcon } from "@radix-ui/react-icons";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Daily Set",
  description: "Play the daily Set puzzle with your friends",
  icons: {
    icon: "/favicon.ico",
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
    <div className="w-screen h-screen flex flex-col gap-4">
      <div className="flex flex-row justify-between p-4 border-b-2 border-gray-200 dark:border-gray-800">
        <div className="flex flex-row gap-2">
          <Link href="/">
            <Button variant="secondary" size="icon" className="rounded-full">
              <HomeIcon className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/leaderboard">
            <Button variant="secondary">Leaderboards</Button>
          </Link>
        </div>
        {viewer === null ? (
          <Link href="/signin">
            <Button>Sign in</Button>
          </Link>
        ) : (
          <UserMenu>{viewer.name ?? viewer.email}</UserMenu>
        )}
      </div>
      <div className="flex w-screen flex-grow min-h-1">{children}</div>
    </div>
  );
}
