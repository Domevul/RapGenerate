import type { Metadata } from "next";
import { M_PLUS_Rounded_1c, Space_Grotesk, Train_One } from "next/font/google";
import "./globals.css";

const mPlusRounded = M_PLUS_Rounded_1c({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-m-plus-rounded",
});

const spaceGrotesk = Space_Grotesk({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const trainOne = Train_One({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-train-one",
});

export const metadata: Metadata = {
  title: "MC BATTLE - Rap Battle Game",
  description: "Ultimate rap battle word game",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${mPlusRounded.variable} ${spaceGrotesk.variable} ${trainOne.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
