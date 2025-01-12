import { ThemeProvider } from "next-themes";
import NavigtionBar from "@/components/custom/NavigationBar";
import "./globals.css";
import ContactSection from "@/components/custom/ContactSection";

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
              <NavigtionBar />
              <div className="w-full max-w-full">
                <div className="m-2 rounded-lg border-2 border-hackomania-red p-4 text-lg font-medium text-hackomania-red md:mx-20">
                  <p>
                    We are still actively updating the website! Please check back for more
                    information! :)
                  </p>
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
