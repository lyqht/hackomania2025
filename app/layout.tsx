import ContactSection from "@/components/custom/ContactSection";
import { ThemeProvider } from "next-themes";
import { cheyenneSans, nexaRust } from "./fonts";
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
    <html
      lang="en"
      className={`${nexaRust.variable} ${cheyenneSans.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="flex min-h-screen flex-col items-center">
            <div className="flex w-full flex-1 flex-col items-center">
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
