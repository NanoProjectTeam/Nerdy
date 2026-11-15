import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Nerdy • Discord Recreated (100% Free Cosmetics & Nitro)',
  description: 'Um, actually... Discord with all paywalled cosmetics, avatar decorations, profile effects, 4K screen share, and soundboard unlocked for free!',
  icons: {
    icon: '/mascot.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#313338] text-[#DBDEE1] h-screen w-screen overflow-hidden antialiased select-none font-sans">
        {children}
      </body>
    </html>
  );
}
