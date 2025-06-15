import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { personSchema } from "../lib/schema";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Vasilis Papageorgiou - PhD Student at UW-Madison",
    template: "%s | Vasilis Papageorgiou"
  },
  description: "Vasilis Papageorgiou is a 3rd year PhD student in Computer Science at UW-Madison, working on LLMs, ML, and Deep Learning with a focus on reasoning models. Currently an intern at AWS AI Labs.",
  keywords: ["Vasilis Papageorgiou", "PhD", "Computer Science", "UW-Madison", "Machine Learning", "Deep Learning", "LLMs", "Reasoning Models", "AWS AI Labs"],
  authors: [{ name: "Vasilis Papageorgiou" }],
  creator: "Vasilis Papageorgiou",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://v-papageorgiou.github.io",
    siteName: "Vasilis Papageorgiou",
    title: "Vasilis Papageorgiou - PhD Student at UW-Madison",
    description: "PhD student in Computer Science at UW-Madison, working on LLMs, ML, and Deep Learning with a focus on reasoning models.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vasilis Papageorgiou - PhD Student at UW-Madison",
    description: "PhD student in Computer Science at UW-Madison, working on LLMs, ML, and Deep Learning with a focus on reasoning models.",
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
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personSchema),
          }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
