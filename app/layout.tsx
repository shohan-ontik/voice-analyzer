import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AppStateProvider } from "./providers";
import { AppChrome } from "./components/AppChrome";

// Self-hosted variable fonts so the build never has to reach Google Fonts.
const spaceGrotesk = localFont({
  src: "./fonts/SpaceGrotesk.woff2",
  variable: "--font-space-grotesk",
  weight: "500 700",
  display: "swap",
});

const notoSerifBengali = localFont({
  src: "./fonts/NotoSerifBengali.woff2",
  variable: "--font-noto-serif-bengali",
  weight: "400 700",
  display: "swap",
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
