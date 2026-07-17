import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/src/components/Providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Ordo | Unified Productivity Workspace",
  description: "Ordo Console powered unified productivity workspace: Smart Inbox, Time-blocking, Kanban, Automations, and AI Assistant.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0b1326] text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
