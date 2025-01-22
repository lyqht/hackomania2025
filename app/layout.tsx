import ContactSection from "@/components/custom/ContactSection";
import NavigationBar from "@/components/custom/NavigationBar";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "HackOMania 2025",
  description:
    "A local hackathon organised by GeeksHacking Singapore to promote healthy living and connection using technology.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="" suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="flex min-h-screen flex-col items-center">
            <div className="flex w-full flex-1 flex-col items-center">
              <NavigationBar />
              <div className="w-full max-w-full">
                <div className="z-30 m-2 rounded-lg border-2 border-hackomania-red p-4 text-lg font-medium text-hackomania-red md:mx-20">
                  <p>
                    We are still actively updating the website! Please check back for more
                    information! :)
                  </p>

                  <Link
                    href="/auth/github"
                    className="my-5 rounded-md bg-hackomania-red px-4 py-2 text-white"
                  >
                    Already registered? Sign in with GitHub to manage your team
                  </Link>
                </div>
              </div>

              <div className="flex w-full flex-col">{children}</div>
              <footer className="mx-auto flex w-full flex-col items-center justify-center gap-8 border-t bg-hackomania-red py-16 text-center text-xs text-white">
                <ContactSection />
                {/* Hide theme switcher for now until we support dark mode design */}
                {/* <ThemeSwitcher /> */}
              </footer>
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
