import type { Metadata } from "next";
import { JetBrains_Mono, Manrope, Newsreader } from "next/font/google";
import "./globals.css";
import { personSchema } from "../lib/schema";
import { themeInitializationScript } from "@/lib/appearance";

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-primary",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-reading",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-code",
});

export const metadata: Metadata = {
  title: {
    default: "Vasilis Papageorgiou - PhD Student at UW-Madison",
    template: "%s | Vasilis Papageorgiou"
  },
  description: "Vasilis Papageorgiou is a 5th year PhD student in Computer Science at UW-Madison, working on LLMs, ML, and Deep Learning with a focus on reasoning models.",
  keywords: ["Vasilis Papageorgiou", "PhD", "Computer Science", "UW-Madison", "Machine Learning", "Deep Learning", "LLMs", "Reasoning Models", "AWS AI Labs", "Dimitris Papailiopoulos", "Technical University of Crete"],
  authors: [{ name: "Vasilis Papageorgiou" }],
  creator: "Vasilis Papageorgiou",
  metadataBase: new URL('https://v-papageorgiou.github.io'),
  alternates: {
    canonical: 'https://v-papageorgiou.github.io',
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://v-papageorgiou.github.io",
    siteName: "Vasilis Papageorgiou",
    title: "Vasilis Papageorgiou - PhD Student at UW-Madison",
    description: "PhD student in Computer Science at UW-Madison, working on LLMs, ML, and Deep Learning with a focus on reasoning models.",
    images: [{
      url: "https://v-papageorgiou.github.io/profile.jpg",
      width: 400,
      height: 400,
      alt: "Vasilis Papageorgiou",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vasilis Papageorgiou - PhD Student at UW-Madison",
    description: "PhD student in Computer Science at UW-Madison, working on LLMs, ML, and Deep Learning with a focus on reasoning models.",
    images: ["https://v-papageorgiou.github.io/profile.jpg"],
    creator: "@vpapageorgiou_",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitializationScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personSchema),
          }}
        />
      </head>
      <body className={`${manrope.variable} ${newsreader.variable} ${jetbrainsMono.variable} antialiased`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 bg-foreground text-background px-4 py-2 rounded"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
