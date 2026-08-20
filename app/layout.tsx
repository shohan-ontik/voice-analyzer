import type { Metadata } from "next";
import { Space_Grotesk, Work_Sans, Hind_Siliguri } from "next/font/google";
import "./globals.css";
import { AppStateProvider } from "./providers";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const hindSiliguri = Hind_Siliguri({
  variable: "--font-hind-siliguri",
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "PitchPerfect — Sales Pitch Trainer",
  description: "Practice your sales pitch and get instant AI feedback on presentation, correctness, pronunciation and soft skills.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${workSans.variable} ${hindSiliguri.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <AppStateProvider>{children}</AppStateProvider>
      </body>
    </html>
  );
}
