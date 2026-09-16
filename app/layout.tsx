import type { Metadata } from "next";
import { Noto_Serif_Bengali, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { AppStateProvider } from "./providers";
import { AppChrome } from "./components/AppChrome";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const notoSerifBengali = Noto_Serif_Bengali({
  variable: "--font-noto-serif-bengali",
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "PitchPerfect — Sales Pitch Trainer",
  description:
    "Practice your sales pitch and get instant AI feedback on presentation, correctness, pronunciation and soft skills.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${notoSerifBengali.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <AppStateProvider>
          <AppChrome>{children}</AppChrome>
        </AppStateProvider>
      </body>
    </html>
  );
}
